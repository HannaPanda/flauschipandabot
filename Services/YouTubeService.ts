import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config({ path: __dirname + '/../.env' });

class YouTubeService {
    private downloadPath = path.resolve(__dirname, "../downloads");
    private apiKey = process.env.LOADER_API_KEY || "";
    private downloadApiUrl = "https://loader.to/ajax/download.php";
    private progressApiUrl = "https://p.oceansaver.in/ajax/progress.php";
    private defaultMp4Format = "1080";

    constructor() {
        if (!fs.existsSync(this.downloadPath)) {
            fs.mkdirSync(this.downloadPath, { recursive: true });
        }
    }

    /**
     * Downloads a YouTube video as an MP3 file using the Loader.to API.
     * @param url The YouTube URL.
     * @returns The file path of the downloaded MP3.
     */
    public async downloadMp3(url: string): Promise<string> {
        return this.downloadFile(url, "mp3");
    }

    /**
     * Downloads a YouTube video as an MP4 file using the Loader.to API.
     * @param url The YouTube URL.
     * @returns The file path of the downloaded MP4.
     */
    public async downloadMp4(url: string): Promise<string> {
        return this.downloadFile(url, this.defaultMp4Format);
    }

    private async downloadFile(url: string, format: string): Promise<string> {
        try {
            console.log(`Starting download request for ${format.toUpperCase()}: ${url}`);

            // Step 1️⃣: Send API request to `download.php`
            const { data: downloadResponse } = await axios.get(this.downloadApiUrl, {
                params: {
                    format: format,
                    url: url,
                    api: this.apiKey
                }
            });

            if (!downloadResponse.success) {
                throw new Error(`Error starting download: ${JSON.stringify(downloadResponse)}`);
            }

            const downloadId = downloadResponse.id;
            console.log(`Download started, ID: ${downloadId}`);

            // Step 2️⃣: Poll progress API until `progress` reaches 1000
            let progress = 0;
            let downloadUrl = null;

            while (progress < 1000) {
                await this.sleep(5000); // Wait 5 seconds to avoid rate limits

                const { data: progressResponse } = await axios.get(this.progressApiUrl, {
                    params: { id: downloadId }
                });

                progress = progressResponse.progress || 0;
                console.log(`Download progress: ${progress / 10}%`);

                if (progressResponse.success === 1 && progress === 1000 && progressResponse.download_url) {
                    downloadUrl = progressResponse.download_url;
                    break;
                }
            }

            if (!downloadUrl) {
                throw new Error(`Failed to retrieve download URL.`);
            }

            console.log(`Download ready: ${downloadUrl}`);

            // Step 3️⃣: Download the file and save locally
            const filePath = await this.saveFile(downloadUrl, format === "mp3" ? "downloaded_audio.mp3" : "downloaded_video.mp4");
            console.log(`${format.toUpperCase()} saved at: ${filePath}`);

            return filePath;
        } catch (err) {
            console.error(`Error during MP3 download: ${err.message}`);
            throw err;
        }
    }

    /**
     * Downloads the file from the given URL and saves it locally.
     */
    private async saveFile(downloadUrl: string, defaultFilename: string): Promise<string> {
        const response = await axios.get(downloadUrl, { responseType: "stream" });

        // Step 3️⃣a: Retrieve filename from HTTP headers (if available)
        let filename = defaultFilename;
        const contentDisposition = response.headers["content-disposition"];

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+?)"/);
            if (match && match[1]) {
                filename = match[1];
            }
        }

        // Step 3️⃣b: Generate a safe file path
        const safeFilename = filename.replace(/[\/\\?%*:|"<>]/g, "").trim();
        const filePath = path.join(this.downloadPath, safeFilename);

        // Step 3️⃣c: Save the file
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(filePath));
            writer.on("error", reject);
        });
    }

    /**
     * Sleep utility to delay API polling.
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const youtubeService = new YouTubeService();
export default youtubeService;

