import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";
import openAiClient from "../Clients/openAiClient";

class NichtSagenRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "5 Minuten ein bestimmtes Wort nicht benutzen";
    handler  = async (message) => {
        console.log(message);
        await openAiClient.botSay( '5 Minuten das Wort "'+message.message+'" nicht benutzen, sonst gibt es Lakritze!');
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
        server.getIO().emit('countdown');
    };
}

const nichtSagenRedeemCommand = new NichtSagenRedeemCommand();

export default nichtSagenRedeemCommand;
