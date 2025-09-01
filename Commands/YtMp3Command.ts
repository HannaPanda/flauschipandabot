import AbstractCommand from "../Abstracts/AbstractCommand";
import youtubeService from "../Services/YouTubeService";
//import megaService from "../Services/MegaService";
import sayService from "../Services/SayService";
import megaService from "../Services/MegaService";

class YtMp3Command extends AbstractCommand {
    isActive = true;
    isModOnly = false;
    isOwnerOnly = true;
    command = "ytmp3";
    description = "Lädt ein YouTube-Video als MP3 herunter und speichert es auf Mega.";

    customHandler = async (message, parts, context, origin, channel) => {
        /*if (parts.length < 2) {
            sayService.say(origin, context.displayName, '', channel, "Bitte gib eine YouTube-URL an.");
            return;
        }

        const url = parts[1];

        try {
            sayService.say(origin, context.displayName, '', channel, "Lade Video herunter...");
            const mp3Path = await youtubeService.downloadMp3(url);

            sayService.say(origin, context.displayName, '', channel, "Lade Datei auf Mega hoch...");
            const fileUrl = await megaService.uploadFile(mp3Path);

            sayService.say(origin, context.displayName, '', channel, `MP3 erfolgreich hochgeladen: ${fileUrl}`);
        } catch (err) {
            sayService.say(origin, context.displayName, '', channel, `Fehler: ${err.message}`);
        }*/
    };
}

const ytMp3Command = new YtMp3Command();
export default ytMp3Command;
