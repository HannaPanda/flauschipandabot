import { Router, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import myInstantsService from "../Services/MyInstantsService"
import wallpaperAbyssService from "../Services/WallpaperAbyssService"
const { TwingEnvironment, TwingLoaderFilesystem } = require('twing')

let loader = new TwingLoaderFilesystem('./Templates')
let twing = new TwingEnvironment(loader)

const router = Router()

// Liste erlaubter Ordner zur Sicherheit
const allowedAudioFolders = ['audio', 'myAudioFolder1', 'myAudioFolder2']
const allowedBgFolders = ['backgrounds', 'myBgFolder1', 'myBgFolder2']

// Route für /poltergeist
router.get('/poltergeist', (req: Request, res: Response): void => {
    const audioFolder = (req.query.audioFolder as string) || 'audio'
    const bgFolder = (req.query.bgFolder as string) || 'backgrounds'

    // Validierung der Ordner
    const sanitizedAudioFolder = allowedAudioFolders.includes(audioFolder) ? audioFolder : 'audio'
    const sanitizedBgFolder = allowedBgFolders.includes(bgFolder) ? bgFolder : 'backgrounds'

    twing.render('poltergeist.twig', {
        activePage: 'poltergeist',
        audioFolder: sanitizedAudioFolder,
        bgFolder: sanitizedBgFolder,
    }).then((output: string) => {
        res.end(output)
    }).catch(error => {
        console.error('Error rendering poltergeist page:', error)
        res.status(500).send('Rendering error')
    })
})

// Hilfsfunktion zum Abrufen von Dateien
function getFilesFromDir(dir: string, fileTypes: string[], ignoreDirs: string[] = []): string[] {
    let filesToReturn: string[] = []
    function walkDir(currentPath: string) {
        const files = fs.readdirSync(currentPath)
        for (const file of files) {
            const curFile = path.join(currentPath, file)
            if (fs.statSync(curFile).isDirectory()) {
                const folderName = path.basename(curFile)
                if (!ignoreDirs.includes(folderName)) {
                    walkDir(curFile)
                }
            } else if (fs.statSync(curFile).isFile() && fileTypes.includes(path.extname(curFile).toLowerCase())) {
                const relativePath = path.relative(dir, curFile).replace(/\\/g, '/')
                filesToReturn.push(relativePath)
            }
        }
    }
    walkDir(dir)
    return filesToReturn
}

// Endpunkt für Audiodateien
router.get('/api/poltergeist/audio', async (req: Request, res: Response): Promise<void> => {
    try {
        // Versuch, eine zufällige Audio-URL vom MyInstantsService zu holen
        const audio = await myInstantsService.getRandomAudio()
        if (audio) {
            res.json(audio)
            return
        }
    } catch (error) {
        console.error('Error fetching audio from MyInstantsService:', error)
    }

    // Fallback zu lokalen Audiodateien, wenn MyInstantsService fehlschlägt
    const audioFolder = (req.query.audioFolder as string) || 'audio'
    const sanitizedAudioFolder = allowedAudioFolders.includes(audioFolder) ? audioFolder : 'audio'
    const audioDir = path.join(__dirname, '../public/', sanitizedAudioFolder)
    const audioFiles = getFilesFromDir(audioDir, ['.mp3', '.wav', '.ogg'], ['tmp'])

    if (audioFiles.length > 0) {
        const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)]
        res.json({ url: `/static/${sanitizedAudioFolder}/${randomFile}` })
    } else {
        res.status(404).json({ error: 'No audio files available' })
    }
})

// Endpunkt für Hintergrunddateien
router.get('/api/poltergeist/backgrounds', async (req: Request, res: Response): Promise<void> => {
    const bgFolder = (req.query.bgFolder as string) || 'backgrounds'
    const category = (req.query.category as string) || 'cat'
    const sanitizedBgFolder = allowedBgFolders.includes(bgFolder) ? bgFolder : 'backgrounds'

    try {
        // Versuch, eine zufällige Wallpaper-URL vom WallpaperAbyssService zu holen
        const wallpaper = await wallpaperAbyssService.getRandomWallpaperData(category);
        console.log(wallpaper);
        if (wallpaper) {
            res.json(wallpaper)
            return
        }
    } catch (error) {
        console.error('Error fetching wallpaper from WallpaperAbyssService:', error)
    }

    // Fallback zu lokalen Hintergrunddateien, wenn WallpaperAbyssService fehlschlägt
    const bgDir = path.join(__dirname, '../public/', sanitizedBgFolder)
    const bgFiles = getFilesFromDir(bgDir, ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm'])

    if (bgFiles.length > 0) {
        const randomFile = bgFiles[Math.floor(Math.random() * bgFiles.length)]
        res.json({ url: `/static/${sanitizedBgFolder}/${randomFile}` })
    } else {
        res.status(404).json({ error: 'No background files available' })
    }
})

export default router
