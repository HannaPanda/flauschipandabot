import * as dotenv from "dotenv";
import axios from "axios";
import { JSDOM } from "jsdom";
dotenv.config({ path: __dirname + '/../.env' });

class MyInstantsService {
    async getRandomAudioUrl(): Promise<string> {
        let audioUrl = '';
        let isValidUrl = false;

        while (!isValidUrl) {
            try {
                // Generate a random page number between 1 and 50
                const randomPage = Math.floor(Math.random() * 50) + 1;
                const url = `https://www.myinstants.com/de/trending/de/?page=${randomPage}`;

                // Fetch the HTML from the page
                const response = await axios.get(url);
                const dom = new JSDOM(response.data);

                // Select all buttons with the play() onclick attribute
                const buttons = dom.window.document.querySelectorAll('button.small-button[onclick^="play("]');

                if (buttons.length > 0) {
                    // Choose a random button from the list
                    const randomButtonIndex = Math.floor(Math.random() * buttons.length);
                    const button = buttons[randomButtonIndex];
                    const onclickAttr = button.getAttribute('onclick');

                    // Extract the audio path from the onclick attribute
                    const match = onclickAttr?.match(/play\('([^']+)'/);
                    if (match && match[1]) {
                        audioUrl = `https://www.myinstants.com${match[1]}`;
                        isValidUrl = true;
                    }
                }
            } catch (error) {
                // If a request fails (e.g., 404), continue the loop to try again
                console.error('Error fetching page, trying another page...', error);
            }
        }

        return audioUrl;
    }
}

const myInstantsService = new MyInstantsService();
export default myInstantsService;