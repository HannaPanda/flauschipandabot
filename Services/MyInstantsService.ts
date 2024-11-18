import * as dotenv from "dotenv";
import axios from "axios";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
dotenv.config({ path: __dirname + '/../.env' });

class MyInstantsService {
    async getRandomAudio(): Promise<{ url: string; title: string }> {
        let audioUrl = '';
        let audioTitle = '';
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
                    // Filter out buttons with titles containing Cyrillic characters
                    const filteredButtons = Array.from(buttons).filter((button: HTMLButtonElement) => {
                        const title = button.getAttribute('title') || '';
                        return !/[Ѐ-ӿ]/.test(title); // Match Cyrillic characters
                    });

                    if (filteredButtons.length > 0) {
                        // Choose a random button from the filtered list
                        const randomButtonIndex = Math.floor(Math.random() * filteredButtons.length);
                        const button = filteredButtons[randomButtonIndex] as HTMLButtonElement;
                        const onclickAttr = button.getAttribute('onclick');
                        audioTitle = (button.getAttribute('title') || '').replace(/^Ton von /, '').replace(/ abspielen$/, '');

                        // Extract the audio path from the onclick attribute
                        const match = onclickAttr?.match(/play\('([^']+)'/);
                        if (match && match[1]) {
                            audioUrl = `https://www.myinstants.com${match[1]}`;
                            audioUrl = await this.downloadAndNormalizeAudio(audioUrl);
                            isValidUrl = true;
                        }
                    }
                }
            } catch (error) {
                // If a request fails (e.g., 404), continue the loop to try again
                console.error('Error fetching page, trying another page...', error);
            }
        }

        return { url: audioUrl, title: audioTitle };
    }

    async downloadAndNormalizeAudio(url: string): Promise<string> {
        const audioDirectory = path.resolve(__dirname, '../public/audio/tmp');
        if (!fs.existsSync(audioDirectory)) {
            fs.mkdirSync(audioDirectory, { recursive: true });
        }

        const fileName = `audio_${Date.now()}.mp3`;
        const filePath = path.join(audioDirectory, fileName);

        try {
            // Download the audio file
            const response = await axios.get(url, { responseType: 'stream' });
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise<void>((resolve, reject) => {
                writer.on('finish', () => resolve());
                writer.on('error', reject);
            });

            // Normalize the audio file using 2-pass loudnorm
            const normalizedFilePath = path.join(audioDirectory, `normalized_${fileName}`);
            await this.normalizeAudioTwoPass(filePath, normalizedFilePath);

            // Remove the original file after normalization
            fs.unlinkSync(filePath);

            return `https://www.hannapanda.de/static/audio/tmp/normalized_${fileName}`;
        } catch (error) {
            console.error('Error downloading or normalizing audio:', error);
            throw error;
        }
    }

    normalizeAudioTwoPass(inputPath: string, outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // Use ffmpeg to normalize the audio volume in 2-pass mode
            const commandFirstPass = `ffmpeg -i "${inputPath}" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=summary -f null -`;
            exec(commandFirstPass, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error during first pass of audio normalization:', error);
                    reject(error);
                } else {
                    // Extract the normalization parameters from the first pass (stderr instead of stdout)
                    const inputI = stderr.match(/Input Integrated:\s+([-\d\.]+)/)?.[1];
                    const inputTP = stderr.match(/Input True Peak:\s+([-\d\.]+)/)?.[1];
                    const inputLRA = stderr.match(/Input LRA:\s+([-\d\.]+)/)?.[1];
                    const inputThresh = stderr.match(/Input Threshold:\s+([-\d\.]+)/)?.[1];

                    if (inputI && inputTP && inputLRA && inputThresh) {
                        const commandSecondPass = `ffmpeg -i "${inputPath}" -af loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${inputI}:measured_TP=${inputTP}:measured_LRA=${inputLRA}:measured_thresh=${inputThresh}:offset=0:linear=true:print_format=summary "${outputPath}"`;

                        exec(commandSecondPass, (error, stdout, stderr) => {
                            if (error) {
                                console.error('Error during second pass of audio normalization:', stderr);
                                reject(error);
                            } else {
                                console.log('Audio normalized successfully (2-pass)');
                                resolve();
                            }
                        });
                    } else {
                        reject(new Error('Could not extract normalization parameters from first pass.'));
                    }
                }
            });
        });
    }
}

const myInstantsService = new MyInstantsService();
export default myInstantsService;
