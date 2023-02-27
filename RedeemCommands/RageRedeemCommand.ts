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

class RageRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Rage Game im nächsten Stream";
    handler  = (message) => {
        const hype = 'emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry ' +
            'emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry ' +
            'emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry ' +
            'emote_angry emote_angry emote_angry emote_angry emote_angry';
        emitter.emit('playAudio', {file: 'fuuu.mp3', mediaType: 'audio', volume: 0.1});
        sayService.say('tmi', '', '', null, hype);
        sayService.say('tmi', '', '', null, hype);
    };
}

const rageRedeemCommand = new RageRedeemCommand();

export default rageRedeemCommand;