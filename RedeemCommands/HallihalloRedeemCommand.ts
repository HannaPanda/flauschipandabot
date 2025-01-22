import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";

class HallihalloRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Hallihallo!";
    handler  = (message) => {
        server.getIO().emit('showImage', {file: 'hallihallo.png', mediaType: 'image', duration: 5000});
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const hallihalloRedeemCommand = new HallihalloRedeemCommand();

export default hallihalloRedeemCommand;
