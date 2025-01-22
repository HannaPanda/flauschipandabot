import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";

class RueckwaertsRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Rückwärts, rückwärts";
    handler  = (message) => {
        server.getIO().emit('showImage', {file: 'rückwärts.png', mediaType: 'image', duration: 5000});
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const rueckwaertsRedeemCommand = new RueckwaertsRedeemCommand();

export default rueckwaertsRedeemCommand;
