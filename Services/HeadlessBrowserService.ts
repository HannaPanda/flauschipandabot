import { Browser, Page } from 'puppeteer';
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

class HeadlessBrowserService {
    private browser: Browser | null = null;

    async getBrowser(): Promise<Browser> {
        if (this.browser === null) {
            console.log('Launching headless browser...');
            puppeteer.use(StealthPlugin());
            this.browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: 'shell'
            });
        }
        return Promise.resolve(this.browser);
    }

    async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
        return Promise.resolve();
    }

    async getNewPage(): Promise<Page> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        // Generate a random User Agent each time a new page is requested
        const operatingSystems = [
            'Windows NT 10.0; Win64; x64',
            'Macintosh; Intel Mac OS X 10_15_7',
            'X11; Linux x86_64',
            'iPhone; CPU iPhone OS 14_6 like Mac OS X',
            'Windows NT 6.1; Win64; x64',
            'Windows NT 10.0; WOW64',
            'Linux; Android 10; SM-G973F',
            'Linux; Android 11; SM-A515F',
            'Windows NT 5.1; Win32',
            'Macintosh; Intel Mac OS X 11_2_3'
        ];

        const browsers = [
            {
                name: 'Chrome',
                versions: ['113.0.0.0', '91.0.4472.114', '58.0.3029.110', '85.0.4183.121', '89.0.4389.72', '114.0.5735.110', '115.0.5790.102', '116.0.5845.96']
            },
            {
                name: 'Safari',
                versions: ['605.1.15', '604.5.6', '605.1.13', '606.1.17']
            },
            {
                name: 'Trident',
                versions: ['7.0', '6.0', '5.0']
            },
            {
                name: 'Firefox',
                versions: ['90.0', '91.0', '92.0', '93.0', '94.0', '95.0', '96.0']
            },
            {
                name: 'Edge',
                versions: ['91.0.864.48', '92.0.902.62', '93.0.961.38', '94.0.992.47']
            },
            {
                name: 'Opera',
                versions: ['76.0.4017.123', '77.0.4054.172', '78.0.4093.147']
            }
        ];

        const browserEngines = [
            'AppleWebKit/537.36',
            'AppleWebKit/605.1.15',
            'Trident/7.0',
            'Gecko/20100101',
            'AppleWebKit/538.1',
            'Blink/537.36',
            'WebKit/537.36'
        ];

        const devices = [
            '',
            'Mobile',
            'Tablet',
            'SmartTV',
            'Wearable'
        ];

        const randomOS = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
        const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
        const randomVersion = randomBrowser.versions[Math.floor(Math.random() * randomBrowser.versions.length)];
        const randomEngine = browserEngines[Math.floor(Math.random() * browserEngines.length)];
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];

        let userAgent = `Mozilla/5.0 (${randomOS}) ${randomEngine} (KHTML, like Gecko) ${randomBrowser.name}/${randomVersion}`;
        if (randomBrowser.name === 'Safari') {
            userAgent += ` Version/14.0 ${randomDevice ? randomDevice + '/' : ''}15E148 Safari/604.1`;
        } else if (randomBrowser.name === 'Trident') {
            userAgent = `Mozilla/5.0 (${randomOS}) like Gecko rv:11.0 ${randomBrowser.name}`;
        } else if (randomBrowser.name === 'Firefox') {
            userAgent = `Mozilla/5.0 (${randomOS}; rv:${randomVersion}) Gecko/20100101 Firefox/${randomVersion}`;
        } else if (randomBrowser.name === 'Edge') {
            userAgent = `Mozilla/5.0 (${randomOS}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomVersion} Safari/537.36 Edge/${randomVersion}`;
        } else if (randomBrowser.name === 'Opera') {
            userAgent = `Mozilla/5.0 (${randomOS}) Presto/2.12.388 Version/${randomVersion} Opera/${randomVersion}`;
        }

        await page.setUserAgent(userAgent);

        return Promise.resolve(page);
    }

    async closePage(page: Page): Promise<void> {
        if (page) {
            await page.close();
        }
        return Promise.resolve();
    }
}

const headlessBrowserService = new HeadlessBrowserService();
export default headlessBrowserService;
