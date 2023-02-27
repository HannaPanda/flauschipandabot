import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class UnlurkCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'unlurk';
    description    = 'Bin wieder da';
    answerNoTarget = '###ORIGIN### ist wieder da! emote_hype';
    answerTarget   = '';
    globalCooldown = 0;
    customHandler  = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        sayService.say(origin, context['display-name'], '', channel, this.answerNoTarget);
        emitter.emit('playAudio', {file: 'weird.wav', mediaType: 'audio', volume: 0.5});
    };
}

let unlurkCommand = new UnlurkCommand();

export default unlurkCommand;