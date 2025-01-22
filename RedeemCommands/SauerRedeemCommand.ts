import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";
import openAiClient from "../Clients/openAiClient";

class SauerRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Sauer macht lustig! Ein Center Shock bitte.";
    handler  = async (message) => {
        await openAiClient.botSay( 'Sauer macht lustig');
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const sauerRedeemCommand = new SauerRedeemCommand();

export default sauerRedeemCommand;
