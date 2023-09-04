import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";
import emoteService from "../Services/EmoteService";
dotenv.config({ path: __dirname+'/../.env' });

class HypeCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'hype';
    description    = 'HYPE HYPE HYPE';
    answerNoTarget = 'emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype ';
    answerTarget   = '';
    globalCooldown = 0;
    customHandler  = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const numberPattern = /\d+/g;
        const numbers = parts.slice(1).join(' ').match( numberPattern );
        const number = (numbers) ? numbers.join('') : '';
        const numberOfPlays = Math.min(5, (number !== '' && parseInt(number) > 0) ? parseInt(number) : 1);

        for(let i = 0; i < numberOfPlays; i++) {
            sayService.say(origin, context.displayName, parts.slice(1).join(' '), channel, this.answerNoTarget);
        }
    };
}

let hypeCommand = new HypeCommand();

export default hypeCommand;