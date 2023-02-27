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

class NichtFluchenRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "5 Minuten nicht fluchen";
    handler  = (message) => {
        emitter.emit('bot.say', '5 Minuten nicht fluchen, sonst gibt es Lakritze!');
        emitter.emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
        emitter.emit('countdown');
    };
}

const nichtFluchenRedeemCommand = new NichtFluchenRedeemCommand();

export default nichtFluchenRedeemCommand;