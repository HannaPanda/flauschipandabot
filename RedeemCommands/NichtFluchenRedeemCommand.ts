import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";
import openAiClient from "../Clients/openAiClient";

class NichtFluchenRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "5 Minuten nicht fluchen";
    handler  = async (message) => {
        await openAiClient.botSay( '5 Minuten nicht fluchen, sonst gibt es Lakritze!');
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
        server.getIO().emit('countdown');
    };
}

const nichtFluchenRedeemCommand = new NichtFluchenRedeemCommand();

export default nichtFluchenRedeemCommand;
