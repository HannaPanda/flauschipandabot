import emitter from "../emitter";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import Fighter from "../Models/Fighter";
import moment from "moment";
import sayService from "../Services/SayService";
import mongoDBClient from "../Clients/mongoDBClient";
import botService from "../Services/BotService";
import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
dotenv.config({ path: __dirname+'/../.env' });

class NichtSagenRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "5 Minuten ein bestimmtes Wort nicht benutzen";
    handler  = (message) => {
        console.log(message);
        emitter.emit('bot.say', '5 Minuten das Wort "'+message.message+'" nicht benutzen, sonst gibt es Lakritze!');
        emitter.emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
        emitter.emit('countdown');
    };
}

const nichtSagenRedeemCommand = new NichtSagenRedeemCommand();

export default nichtSagenRedeemCommand;