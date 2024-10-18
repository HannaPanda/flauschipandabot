import * as dotenv from "dotenv";
import { JSDOM } from "jsdom";
import puppeteer from "puppeteer";
dotenv.config({ path: __dirname + '/../.env' });

class WallpaperAbyssService {
    async getRandomWallpaperUrl(category: string = 'cat'): Promise<string> {
        let wallpaperUrl = '';
        let isValidUrl = false;

        while (!isValidUrl) {
            try {
                // Generate a random page number between 1 and 50
                const randomPage = Math.floor(Math.random() * 50) + 1;
                const url = `https://alphacoders.com/${category}-wallpapers?page=${randomPage}&quickload=1`;

                // Use Puppeteer to fetch the page content
                const browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    headless: 'shell'
                });
                const page = await browser.newPage();
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36');
                await page.goto(url, { waitUntil: 'domcontentloaded' });
                const content = await page.content();
                await browser.close();

                const dom = new JSDOM(content);

                // Select all download buttons with the downloadContent() onclick attribute
                const buttons = dom.window.document.querySelectorAll('span.button-download[onclick^="downloadContent("]');

                if (buttons.length > 0) {
                    // Choose a random button from the list
                    const randomButtonIndex = Math.floor(Math.random() * buttons.length);
                    const button = buttons[randomButtonIndex];
                    const onclickAttr = button.getAttribute('onclick');

                    // Extract the parameters from the downloadContent() function
                    const match = onclickAttr?.match(/downloadContent\('([^']+)',\s*(\d+),\s*'([^']+)'\)/);
                    if (match && match.length === 4) {
                        const subdomain = match[1];
                        const id = match[2];
                        const extension = match[3];
                        const firstThreeDigits = id.substring(0, 3);

                        wallpaperUrl = `https://${subdomain}.alphacoders.com/${firstThreeDigits}/${id}.${extension}`;
                        isValidUrl = true;
                    }
                }
            } catch (error) {
                // If a request fails (e.g., 404 or redirect issue), continue the loop to try again
                console.error('Error fetching page or following redirect, trying another page...', error);
            }
        }

        return wallpaperUrl;
    }
}

const wallpaperAbyssService = new WallpaperAbyssService();
export default wallpaperAbyssService;