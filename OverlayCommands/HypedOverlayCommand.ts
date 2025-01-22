import AbstractOverlayCommand from "../Abstracts/AbstractOverlayCommand";
import server from "../server";

class HypedOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "hyped";
    aliases        = [];
    description    = "LET'S GOOOOOOOOOOOO";
    mediaFile      = "";
    mediaType      = "image";
    volume         = 1;
    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        server.getIO().emit('showImage', {file: 'hyper-excited.gif', mediaType: 'image', duration: 2000});
        server.getIO().emit('playAudio', {file: 'hyped.mp3', mediaType: 'audio', volume: 0.1});
    };
}

let hypedOverlayCommand = new HypedOverlayCommand();

export default hypedOverlayCommand;
