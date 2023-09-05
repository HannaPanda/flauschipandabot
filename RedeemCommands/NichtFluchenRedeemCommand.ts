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
dotenv.config({ path: __dirname+'/../.env' });

class NichtFluchenRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "5 Minuten nicht fluchen";
    handler  = (message) => {
        server.getIO().emit('bot.say', '5 Minuten nicht fluchen, sonst gibt es Lakritze!');
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
        server.getIO().emit('countdown');
    };
}

const nichtFluchenRedeemCommand = new NichtFluchenRedeemCommand();

export default nichtFluchenRedeemCommand;