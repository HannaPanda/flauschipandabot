import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import myInstantsService from "../Services/MyInstantsService";
import wallpaperAbyssService from "../Services/WallpaperAbyssService";
const { TwingEnvironment, TwingLoaderFilesystem } = require('twing');

let loader = new TwingLoaderFilesystem('./Templates');
let twing = new TwingEnvironment(loader);

const router = Router();

// Liste erlaubter Ordner zur Sicherheit
const allowedAudioFolders = ['audio', 'myAudioFolder1', 'myAudioFolder2'];
const allowedBgFolders = ['backgrounds', 'myBgFolder1', 'myBgFolder2'];

// Route für /poltergeist
router.get('/poltergeist', (req, res) => {
    const audioFolder = req.query.audioFolder || 'audio';
    const bgFolder = req.query.bgFolder || 'backgrounds';

    // Validierung der Ordner
    const sanitizedAudioFolder = allowedAudioFolders.includes(audioFolder) ? audioFolder : 'audio';
    const sanitizedBgFolder = allowedBgFolders.includes(bgFolder) ? bgFolder : 'backgrounds';

    twing.render('poltergeist.twig', {
        activePage: 'poltergeist',
        audioFolder: sanitizedAudioFolder,
        bgFolder: sanitizedBgFolder,
    }).then((output: string) => {
        res.end(output);
    });
});

// Hilfsfunktion zum Abrufen von Dateien
function getFilesFromDir(dir: string, fileTypes: string[], ignoreDirs: string[] = []) {
    let filesToReturn: string[] = [];
    function walkDir(currentPath: string) {
        const files = fs.readdirSync(currentPath);
        for (const file of files) {
            const curFile = path.join(currentPath, file);

            if (fs.statSync(curFile).isDirectory()) {
                const folderName = path.basename(curFile);
                if (!ignoreDirs.includes(folderName)) {
                    walkDir(curFile);
                }
            } else if (fs.statSync(curFile).isFile() && fileTypes.includes(path.extname(curFile).toLowerCase())) {
                const relativePath = path.relative(dir, curFile).replace(/\\/g, '/');
                filesToReturn.push(relativePath);
            }
        }
    }
    walkDir(dir);
    return filesToReturn;
}

// Endpunkt für Audiodateien
router.get('/api/poltergeist/audio', async (req, res) => {
    try {
        // Try to get a random audio URL from MyInstantsService
        const audioUrl = await myInstantsService.getRandomAudioUrl();
        if (audioUrl) {
            return res.json({ url: audioUrl });
        }
    } catch (error) {
        console.error('Error fetching audio from MyInstantsService:', error);
    }

    // Fallback to local audio files if MyInstantsService fails
    const audioFolder = req.query.audioFolder || 'audio';
    const sanitizedAudioFolder = allowedAudioFolders.includes(audioFolder) ? audioFolder : 'audio';

    const audioDir = path.join(__dirname, '../public/', sanitizedAudioFolder);
    const audioFiles = getFilesFromDir(audioDir, ['.mp3', '.wav', '.ogg'], ['tmp']);

    if (audioFiles.length > 0) {
        // Return a random local audio file
        const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        return res.json({ url: `/static/${sanitizedAudioFolder}/${randomFile}` });
    } else {
        return res.status(404).json({ error: 'No audio files available' });
    }
});

// Endpunkt für Hintergrunddateien
router.get('/api/poltergeist/backgrounds', async (req, res) => {
    const bgFolder = req.query.bgFolder || 'backgrounds';
    const category = req.query.category || 'cat';
    const sanitizedBgFolder = allowedBgFolders.includes(bgFolder) ? bgFolder : 'backgrounds';

    try {
        // Try to get a random wallpaper URL from WallpaperAbyssService
        const wallpaperUrl = await wallpaperAbyssService.getRandomWallpaperUrl(category);
        if (wallpaperUrl) {
            return res.json({ url: wallpaperUrl });
        }
    } catch (error) {
        console.error('Error fetching wallpaper from WallpaperAbyssService:', error);
    }

    // Fallback to local background files if WallpaperAbyssService fails
    const bgDir = path.join(__dirname, '../public/', sanitizedBgFolder);
    const bgFiles = getFilesFromDir(bgDir, ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm']);

    if (bgFiles.length > 0) {
        // Return a random local background file
        const randomFile = bgFiles[Math.floor(Math.random() * bgFiles.length)];
        return res.json({ url: `/static/${sanitizedBgFolder}/${randomFile}` });
    } else {
        return res.status(404).json({ error: 'No background files available' });
    }
});

export default router;
