import { JSDOM } from "jsdom";
import headlessBrowserService from "./HeadlessBrowserService";
import replService from "./ReplService";
import WallpaperModel from "../Models/Wallpaper";

class WallpaperAbyssService {
    private wallpaperLinks: string[] = [];
    private currentPage: number = 1;
    private currentCategory: string = '';

    async getRandomWallpaperData(category: string = 'cat'): Promise<{ url: string, attribution: string }> {
        let wallpaper = null;

        try {
            // Search for wallpapers in the given category
            wallpaper = await WallpaperModel.findRandomByCategory(category);

            // If no wallpaper is found, default to category 'cat'
            if (!wallpaper) {
                console.log(`No wallpapers found for category: ${category}. Switching to default category 'cat'.`);
                wallpaper = await WallpaperModel.findRandomByCategory('cat');
            }
        } catch (error) {
            console.error('Error retrieving wallpaper data:', error);
            throw error;
        }

        if (!wallpaper) {
            throw new Error('No wallpapers available in the database for the specified category or default category.');
        }

        // Prepare the response
        const wallpaperUrl = `${wallpaper.path}`;
        const attribution = wallpaper.attribution;

        return { url: wallpaperUrl, attribution };
    }

    async startDownloadProcess(category: string = 'cat', startPage: number = 1): Promise<void> {
        this.currentCategory = category;
        this.currentPage = startPage;
        this.wallpaperLinks = [];
        await this.fetchWallpaperLinks();
    }

    private async fetchWallpaperLinks(): Promise<void> {
        const url = `https://alphacoders.com/${this.currentCategory}-wallpapers?page=${this.currentPage}`;

        try {
            // Use Puppeteer to fetch the page content
            const page = await headlessBrowserService.getNewPage();
            await page.goto(url, { waitUntil: 'networkidle0' });
            await new Promise(f => setTimeout(f, 10000));
            const content = await page.content();
            const dom = new JSDOM(content);

            // Check if the specified string is present on the page
            if (content.includes("It looks like your filtered out everything that matched your term and resolution!")) {
                console.log("No results found for the given term and resolution. Aborting...");
                await headlessBrowserService.closeBrowser();
                return;
            }

            // Extract all links to big.php pages
            const links = Array.from(dom.window.document.querySelectorAll('a[href*="big.php"]'));
            links.forEach(link => {
                const href = (link as HTMLAnchorElement).getAttribute('href');
                if (href) {
                    this.wallpaperLinks.push(href);
                }
            });

            console.log(`${this.wallpaperLinks.length} links found on page ${this.currentPage}`);
            await headlessBrowserService.closeBrowser();
        } catch (error) {
            console.error('Error fetching page...', error);
            await headlessBrowserService.closeBrowser();
        }
    }

    getNextWallpaperLink(): string | null {
        return this.wallpaperLinks.length > 0 ? this.wallpaperLinks[0] : null;
    }

    async processWallpaper(keep: boolean): Promise<void> {
        if (this.wallpaperLinks.length === 0) {
            console.log('No more wallpapers to process.');
            return;
        }

        const link = this.wallpaperLinks.shift();
        if (!link) return;

        if (!keep) {
            console.log(`Discarded wallpaper: ${link}`);
            return;
        }

        try {
            // Visit the big.php page to extract wallpaper URL and attribution
            const page = await headlessBrowserService.getNewPage();
            await page.goto(link, { waitUntil: 'networkidle0' });
            const content = await page.content();
            const dom = new JSDOM(content);

            // Extract the main content image URL
            const downloadButton = dom.window.document.querySelector('span.button-download');
            const onclickAttr = downloadButton.getAttribute('onclick');

            // Extract the parameters from the downloadContent() function
            const match = onclickAttr?.match(/downloadContent\('([^']+)',\s*(\d+),\s*'([^']+)'\)/);
            console.log(match);
            if (match && match.length === 4) {
                const subdomain = match[1];
                const id = match[2];
                const extension = match[3];
                const firstThreeDigits = id.substring(0, 3);

                const wallpaperUrl = `https://${subdomain}.alphacoders.com/${firstThreeDigits}/${id}.${extension}`;
                console.log(wallpaperUrl);

                // Extract the wallpaper attribution link
                const artistContainer = dom.window.document.querySelector('div.content-artist-container');
                const submitterContainer = dom.window.document.querySelector('div.content-submitter-container');

                let artistText = artistContainer?.textContent?.trim().replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ') || '';
                if (artistText === 'Add Artist') {
                    artistText = '';
                }
                let submitterText = submitterContainer?.textContent?.trim().replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ') || '';

                const attribution = `${artistText}${artistText && submitterText ? ' | ' : ''}${submitterText}`;
                console.log(attribution);

                // Use WallpaperModel to download and save the image
                await WallpaperModel.downloadAndSaveWallpaper(wallpaperUrl, this.currentCategory, attribution);
            }
            await headlessBrowserService.closeBrowser();
        } catch (error) {
            console.error('Error processing wallpaper...', error);
            await headlessBrowserService.closeBrowser();
        }
    }
}

const wallpaperAbyssService = new WallpaperAbyssService();
export default wallpaperAbyssService;

// Integrate with ReplService
replService.addCommand('downloadAll', async (category: string = 'anime-cat', startPage: string = '1') => {
    const startPageNumber = parseInt(startPage, 10);

    replService.getReplServer().output.write(`Starting download for category: ${category} from page: ${startPageNumber}\n`);

    await wallpaperAbyssService.startDownloadProcess(category, startPageNumber);
    let link = null;
    let ranAtLeastOnce = false;

    while(link = wallpaperAbyssService.getNextWallpaperLink()) {
        ranAtLeastOnce = true;
        replService.getReplServer().output.write(`Processing wallpaper: ${link}\n`);
        await wallpaperAbyssService.processWallpaper(true);
        //await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 4000) + 1000));
    }

    if(!ranAtLeastOnce) {
        return "done";
    }

    const nextPage = startPageNumber + 1;
    replService.getReplServer().output.write(`Proceeding to next page: ${nextPage}\n`);

    await replService.invokeCommand('downloadAll', category, nextPage.toString());
});
