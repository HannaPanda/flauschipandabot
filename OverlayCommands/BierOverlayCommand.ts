import AbstractOverlayCommand from "../Abstracts/AbstractOverlayCommand";
import server from "../server";

class RunOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "bier";
    aliases        = ["!buy"];
    description    = "Ein kühles Blondes";
    mediaFile      = "bier.wav";
    mediaType      = "audio";
    volume         = 0.25;
    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        if(message.startsWith("!bier") || message.startsWith("!buy bier ") || message.startsWith("!buy use bier ")) {
            server.getIO().emit('playAudio', {file: this.mediaFile, mediaType: 'audio', volume: this.volume});
        }
    };
}

let runOverlayCommand = new RunOverlayCommand();

export default runOverlayCommand;
