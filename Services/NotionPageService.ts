import * as dotenv from "dotenv";
import { JSDOM } from "jsdom";
import puppeteer from "puppeteer";
import NodeCache from "node-cache";
dotenv.config({ path: __dirname + '/../.env' });

class NotionPageService {
    private cache: NodeCache;
    private cacheKey: string = 'notion_content';

    constructor() {
        const cacheTTL = parseInt(process.env.CACHE_TTL || '86400', 10);
        this.cache = new NodeCache({ stdTTL: cacheTTL });
    }

    async fetchNotionContent(): Promise<string[]> {
        const cachedContent = this.cache.get<string[]>(this.cacheKey);
        if (cachedContent) {
            return cachedContent;
        }

        const notionUrl = process.env.DREAMTALKING_URL;
        const texts: string[] = [];

        try {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: true
            });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36');
            await page.goto(notionUrl, { waitUntil: 'networkidle2' });
            const content = await page.content();
            await browser.close();

            const dom = new JSDOM(content);
            const document = dom.window.document;

            const elements = document.querySelectorAll('div[data-block-id][class*="notion-numbered_list-block"]');
            elements.forEach(element => {
                const extractedText = element.textContent?.trim();
                if (extractedText) {
                    texts.push(extractedText);
                }
            });

            const filteredTexts = texts.filter(text => text.length > 0);

            this.cache.set(this.cacheKey, filteredTexts);

            return filteredTexts;
        } catch (error) {
            console.error('Error fetching Notion page content:', error);
        }

        return texts;
    }

    async getRandomText(): Promise<string> {
        const texts = await this.fetchNotionContent();
        if (texts.length === 0) {
            throw new Error('No content found');
        }
        const randomIndex = Math.floor(Math.random() * texts.length);
        console.log('Traumreden-Text:', texts[randomIndex].replace(process.env.DREAMTALKING_REPLACE_NAME, process.env.DREAMTALKING_REPLACE_WITH));
        return texts[randomIndex].replace(process.env.DREAMTALKING_REPLACE_NAME, process.env.DREAMTALKING_REPLACE_WITH);
    }
}

const notionPageService = new NotionPageService();
export default notionPageService;
