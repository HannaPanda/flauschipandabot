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

class VipRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "VIP (Very Important Panda)";
    handler  = (message) => {
        const hype = 'emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype ' +
            'emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype ' +
            'emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype ' +
            'emote_hype emote_hype emote_hype emote_hype emote_hype';
        server.getIO().emit('playAudio', {file: 'secret1.wav', mediaType: 'audio', volume: 0.5});
        sayService.say('tmi', '', '', null, hype);
        sayService.say('tmi', '', '', null, hype);
    };
}

const vipRedeemCommand = new VipRedeemCommand();

export default vipRedeemCommand;