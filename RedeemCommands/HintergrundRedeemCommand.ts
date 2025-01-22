import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";

class HintergrundRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Farbe der Beleuchtung ändern";
    handler  = (message) => {
        server.getIO().emit('showImage', {file: 'hintergrund.png', mediaType: 'image', duration: 5000});
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const hintergrundRedeemCommand = new HintergrundRedeemCommand();

export default hintergrundRedeemCommand;
