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