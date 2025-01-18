import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config({ path: __dirname + '/../.env' });

class YouTubeService {
    private downloadPath = path.resolve(__dirname, "../downloads");
    private apiKey = process.env.LOADER_API_KEY || ""; // API-Key aus der .env Datei
    private downloadApiUrl = "https://loader.to/ajax/download.php";
    private progressApiUrl = "https://p.oceansaver.in/ajax/progress.php";

    constructor() {
        if (!fs.existsSync(this.downloadPath)) {
            fs.mkdirSync(this.downloadPath, { recursive: true });
        }
    }

    /**
     * Lädt ein YouTube-Video als MP3 über die Loader.to API herunter.
     * @param url Die YouTube-URL
     * @returns Den Pfad zur heruntergeladenen MP3-Datei
     */
    public async downloadMp3(url: string): Promise<string> {
        try {
            console.log(`Starte Download-Anfrage für: ${url}`);

            // 1️⃣ API Request an `download.php` senden
            const { data: downloadResponse } = await axios.get(this.downloadApiUrl, {
                params: {
                    format: "mp3",
                    url: url,
                    api: this.apiKey
                }
            });

            if (!downloadResponse.success) {
                throw new Error(`Fehler beim Starten des Downloads: ${JSON.stringify(downloadResponse)}`);
            }

            const downloadId = downloadResponse.id;
            console.log(`Download gestartet, ID: ${downloadId}`);

            // 2️⃣ Fortschritt abfragen, bis `progress: 1000`
            let progress = 0;
            let downloadUrl = null;

            while (progress < 1000) {
                await this.sleep(5000); // 5 Sekunden warten, um Rate-Limits zu vermeiden

                const { data: progressResponse } = await axios.get(this.progressApiUrl, {
                    params: { id: downloadId }
                });

                progress = progressResponse.progress || 0;
                console.log(`Download-Fortschritt: ${progress / 10}%`);

                if (progressResponse.success === 1 && progress === 1000 && progressResponse.download_url) {
                    downloadUrl = progressResponse.download_url;
                    break;
                }
            }

            if (!downloadUrl) {
                throw new Error(`Download-URL konnte nicht ermittelt werden.`);
            }

            console.log(`Download bereit: ${downloadUrl}`);

            // 3️⃣ Datei herunterladen & speichern
            const mp3FilePath = await this.saveMp3(downloadUrl);
            console.log(`MP3 gespeichert unter: ${mp3FilePath}`);

            return mp3FilePath;
        } catch (err) {
            console.error(`Fehler beim MP3-Download: ${err.message}`);
            throw err;
        }
    }

    /**
     * Lädt die MP3 von der gegebenen URL herunter und speichert sie.
     */
    private async saveMp3(downloadUrl: string): Promise<string> {
        const response = await axios.get(downloadUrl, { responseType: "stream" });

        // 3️⃣a Dateinamen aus den HTTP-Headern holen (falls verfügbar)
        let filename = "downloaded_audio.mp3"; // Fallback-Name
        const contentDisposition = response.headers["content-disposition"];

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+?)"/);
            if (match && match[1]) {
                filename = match[1];
            }
        }

        // 3️⃣b Sicheren Pfad erzeugen
        const safeFilename = filename.replace(/[\/\\?%*:|"<>]/g, "").trim();
        const filePath = path.join(this.downloadPath, safeFilename);

        // 3️⃣c Datei speichern
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(filePath));
            writer.on("error", reject);
        });
    }

    /**
     * Sleep-Funktion, um API-Polling zu verzögern.
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const youtubeService = new YouTubeService();
export default youtubeService;
