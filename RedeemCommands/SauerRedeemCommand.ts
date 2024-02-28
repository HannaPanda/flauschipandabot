import emitter from "../emitter";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import Fighter from "../Models/Fighter";
import moment from "moment";
import sayService from "../Services/SayService";
import mongoDBClient from "../Clients/mongoDBClient";
import botService from "../Services/BotService";
import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";
import openAiClient from "../Clients/openAiClient";
dotenv.config({ path: __dirname+'/../.env' });

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