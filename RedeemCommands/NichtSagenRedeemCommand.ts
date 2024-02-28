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