import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
const { Storage } = require('megajs');

dotenv.config({ path: __dirname + '/../.env' });

class MegaService {
    private storage: Storage;
    private defaultFolder = "Music"; // Standard-Ordner für Uploads

    constructor() {
        this.initStorage();
    }

    /**
     * Initialisiert die Verbindung zu Mega mit gespeicherten Zugangsdaten.
     */
    private async initStorage() {
        this.storage = await new Storage({
            email: process.env.MEGA_EMAIL,
            password: process.env.MEGA_PASSWORD
        }).ready;
    }

    /**
     * Lädt eine Datei in den Mega-Ordner hoch.
     * @param filePath Der lokale Pfad der Datei
     * @param folderName Der Mega-Ordner, in den hochgeladen wird (Standard: "Music")
     * @returns Die öffentliche Mega-URL zur hochgeladenen Datei
     */
    public async uploadFile(filePath: string, folderName: string = this.defaultFolder): Promise<string> {
        const fileName = path.basename(filePath);
        try {
            if (!this.storage) {
                await this.initStorage();
            }

            const folder = await this.getOrCreateFolder(folderName);

            const file = await folder.upload({name: fileName}, fs.readFileSync(filePath)).complete

            console.log(`Lade ${fileName} in den Mega-Ordner "${folderName}" hoch...`);

            const publicLink = await file.link();

            console.log(`Upload erfolgreich! Datei-URL: ${publicLink}`);

            return publicLink;
        } catch (err) {
            console.error(`Fehler beim Hochladen zu Mega: ${err}`);
            throw err;
        }
    }

    /**
     * Sucht oder erstellt einen Ordner in Mega.
     * @param folderName Der gewünschte Ordnername
     * @returns Das Ordner-Objekt
     */
    private async getOrCreateFolder(folderName: string) {
        let folder = this.storage.find(folderName, true);

        if (!folder) {
            console.log(`Mega-Ordner "${folderName}" existiert nicht. Erstelle neuen Ordner...`);
            folder = await this.storage.mkdir(this.defaultFolder);
        }

        return folder;
    }
}

const megaService = new MegaService();
export default megaService;
