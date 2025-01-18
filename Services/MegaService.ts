import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
const { Storage } = require('megajs');

dotenv.config({ path: __dirname + '/../.env' });

class MegaService {
    private storage: Storage;
    private defaultFolder = "Music"; // Default folder for uploads

    constructor() {
        this.initStorage();
    }

    /**
     * Initializes the connection to MEGA using stored credentials.
     */
    private async initStorage() {
        this.storage = await new Storage({
            email: process.env.MEGA_EMAIL,
            password: process.env.MEGA_PASSWORD
        }).ready;
    }

    /**
     * Uploads a file to the specified MEGA folder.
     * @param filePath The local file path
     * @param folderName The target folder in MEGA (default: "Music")
     * @returns The public MEGA URL of the uploaded file
     */
    public async uploadFile(filePath: string, folderName: string = this.defaultFolder): Promise<string> {
        const fileName = path.basename(filePath);
        try {
            if (!this.storage) {
                await this.initStorage();
            }

            const folder = await this.getOrCreateFolder(folderName);
            const file = await folder.upload({ name: fileName }, fs.readFileSync(filePath)).complete;

            console.log(`Uploading ${fileName} to MEGA folder "${folderName}"...`);

            const publicLink = await file.link();
            console.log(`Upload successful! File URL: ${publicLink}`);

            return publicLink;
        } catch (err) {
            console.error(`Error uploading to MEGA: ${err}`);
            throw err;
        }
    }

    /**
     * Finds or creates a folder in MEGA.
     * @param folderName The desired folder name
     * @returns The folder object
     */
    private async getOrCreateFolder(folderName: string) {
        let folder = this.storage.find(folderName, true);

        if (!folder) {
            console.log(`MEGA folder "${folderName}" does not exist. Creating a new folder...`);
            folder = await this.storage.mkdir(this.defaultFolder);
        }

        return folder;
    }
}

const megaService = new MegaService();
export default megaService;
