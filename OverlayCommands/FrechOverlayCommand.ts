import AbstractOverlayCommand from "../Abstracts/AbstractOverlayCommand";
import server from "../server";
import openAiClient from "../Clients/openAiClient";

class FrechOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "frech";
    aliases        = [];
    description    = "Frech";
    mediaFile      = "";
    mediaType      = "image";
    volume         = 1;
    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        server.getIO().emit('showImage', {file: 'frech.png', mediaType: 'image', duration: 2000});
        await openAiClient.botSay('Frech!');
    };
}

let frechOverlayCommand = new FrechOverlayCommand();

export default frechOverlayCommand;
