import AbstractCommand from "../Abstracts/AbstractCommand";
import youtubeService from "../Services/YouTubeService";
//import megaService from "../Services/MegaService";
import sayService from "../Services/SayService";

class YtMp4Command extends AbstractCommand {
    isActive = true;
    isModOnly = false;
    isOwnerOnly = true;
    command = "ytmp4";
    description = "Lädt ein YouTube-Video als MP4 herunter und speichert es auf Mega.";

    customHandler = async (message, parts, context, origin, channel) => {
        /*if (parts.length < 2) {
            sayService.say(origin, context.displayName, '', channel, "Bitte gib eine YouTube-URL an.");
            return;
        }

        const url = parts[1];

        try {
            sayService.say(origin, context.displayName, '', channel, "Lade Video herunter...");
            const mp4Path = await youtubeService.downloadMp4(url);

            sayService.say(origin, context.displayName, '', channel, "Lade Datei auf Mega hoch...");
            const fileUrl = await megaService.uploadFile(mp4Path, "Videos");

            sayService.say(origin, context.displayName, '', channel, `MP4 erfolgreich hochgeladen: ${fileUrl}`);
        } catch (err) {
            sayService.say(origin, context.displayName, '', channel, `Fehler: ${err.message}`);
        }*/
    };
}

const ytMp4Command = new YtMp4Command();
export default ytMp4Command;
