import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";

class BefehlRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Befehl hinzufügen";
    handler  = (message) => {
        server.getIO().emit('showImage', {file: 'eigener_befehl.png', mediaType: 'image', duration: 5000});
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const befehlRedeemCommand = new BefehlRedeemCommand();

export default befehlRedeemCommand;
