import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import openAiClient from "../Clients/openAiClient";

class SayRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Sage etwas";
    handler  = async (message) => {
        await openAiClient.botSay(message.message);
    };
}

const sayRedeemCommand = new SayRedeemCommand();

export default sayRedeemCommand;
