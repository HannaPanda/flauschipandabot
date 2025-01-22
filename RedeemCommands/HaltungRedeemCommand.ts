import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";

class HaltungRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Haltung annehmen!";
    handler  = (message) => {
        server.getIO().emit('showImage', {file: 'haltung.png', mediaType: 'image', duration: 5000});
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const haltungRedeemCommand = new HaltungRedeemCommand();

export default haltungRedeemCommand;
