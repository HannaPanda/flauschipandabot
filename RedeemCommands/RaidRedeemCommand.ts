import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";

class RaidRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Raid-Anführer";
    handler  = (message) => {
        server.getIO().emit('showImage', {file: 'raid_anfuehrer.png', mediaType: 'image', duration: 5000});
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const raidRedeemCommand = new RaidRedeemCommand();

export default raidRedeemCommand;
