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

class WassermarschRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Wasser Marsch!";
    handler  = (message) => {
        emitter.emit('showImage', {file: 'wasser_marsch.png', mediaType: 'image', duration: 5000});
        emitter.emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const wassermarschRedeemCommand = new WassermarschRedeemCommand();

export default wassermarschRedeemCommand;