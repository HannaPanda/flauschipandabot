import * as dotenv from "dotenv";
import { JSDOM } from "jsdom";
import puppeteer from "puppeteer";
dotenv.config({ path: __dirname + '/../.env' });

class NotionPageService {
    async fetchNotionContent(): Promise<string[]> {
        const notionUrl = process.env.DREAMTALKING_URL;
        const texts = [];

        try {
            // Launch Puppeteer browser to access the Notion page
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: 'shell'
            });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36');
            await page.goto(notionUrl, { waitUntil: 'networkidle2' });
            const content = await page.content();
            await browser.close();

            const dom = new JSDOM(content);
            const document = dom.window.document;

            // Select all elements matching the div structure provided
            const elements = document.querySelectorAll('div[data-block-id][class*="notion-bulleted_list-block"]');
            elements.forEach(element => {
                const textDiv = element.querySelector('[data-content-editable-leaf="true"]');
                if (textDiv) {
                    texts.push(textDiv.textContent.trim());
                }
            });

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
        return texts[randomIndex].replace(process.env.DREAMTALKING_REPLACE_NAME, process.env.DREAMTALKING_REPLACE_WITH);
    }
}

const notionPageService = new NotionPageService();
export default notionPageService;
