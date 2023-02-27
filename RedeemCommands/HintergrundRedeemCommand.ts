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

class HintergrundRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Farbe der Beleuchtung ändern";
    handler  = (message) => {
        emitter.emit('showImage', {file: 'hintergrund.png', mediaType: 'image', duration: 5000});
        emitter.emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const hintergrundRedeemCommand = new HintergrundRedeemCommand();

export default hintergrundRedeemCommand;