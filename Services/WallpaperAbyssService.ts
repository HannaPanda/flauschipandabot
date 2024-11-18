import * as dotenv from "dotenv";
import { JSDOM } from "jsdom";
import puppeteer from "puppeteer";
dotenv.config({ path: __dirname + '/../.env' });

class WallpaperAbyssService {
    async getRandomWallpaperData(category: string = 'cat'): Promise<{ url: string, attribution: string }> {
        let wallpaperUrl = '';
        let attribution = '';
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

                        // Extract the wallpaper attribution link
                        const itemDiv = button.closest('div.item');
                        const attributionLink = itemDiv?.querySelector('div.center > a');

                        if (attributionLink) {
                            const wallpaperPageUrl = attributionLink.getAttribute('href');
                            if (wallpaperPageUrl) {
                                // Visit the wallpaper detail page to extract attribution info
                                await page.goto(wallpaperPageUrl, { waitUntil: 'domcontentloaded' });
                                const detailContent = await page.content();
                                const detailDom = new JSDOM(detailContent);

                                const artistContainer = detailDom.window.document.querySelector('div.content-artist-container');
                                const submitterContainer = detailDom.window.document.querySelector('div.content-submitter-container');

                                let artistText = artistContainer?.textContent?.trim().replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ') || '';
                                if (artistText === 'Add Artist') {
                                    artistText = '';
                                }
                                let submitterText = submitterContainer?.textContent?.trim().replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ') || '';

                                attribution = `${artistText}${artistText && submitterText ? ' | ' : ''}${submitterText}`;
                                isValidUrl = true;
                            }
                        }
                    }
                }
                await browser.close();
            } catch (error) {
                // If a request fails (e.g., 404 or redirect issue), continue the loop to try again
                console.error('Error fetching page or following redirect, trying another page...', error);
            }
        }

        return { url: wallpaperUrl, attribution };
    }
}

const wallpaperAbyssService = new WallpaperAbyssService();
export default wallpaperAbyssService;
