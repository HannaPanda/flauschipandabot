import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";

class WassermarschRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Wasser Marsch!";
    handler  = (message) => {
        server.getIO().emit('showImage', {file: 'wasser_marsch.png', mediaType: 'image', duration: 5000});
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const wassermarschRedeemCommand = new WassermarschRedeemCommand();

export default wassermarschRedeemCommand;
