import AbstractOverlayCommand from "../Abstracts/AbstractOverlayCommand";
import server from "../server";

class KloOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "klo";
    aliases        = [];
    description    = "Wenn man mal muss";
    mediaFile      = "klo1.mp3";
    mediaType      = "audio";
    volume         = 0.5;
    customHandler  = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const sounds = ['klo1.mp3', 'klo2.mp3', 'klo3.mp3', 'klo4.mp3',];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        server.getIO().emit('playAudio', {file: randomSound, mediaType: 'audio', volume: this.volume});
    };

    delay = async (ms: number) => {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}

let kloOverlayCommand = new KloOverlayCommand();

export default kloOverlayCommand;
