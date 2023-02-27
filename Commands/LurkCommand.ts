import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class LurkCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'lurk';
    description    = 'Bin dann mal weg';
    answerNoTarget = '###ORIGIN### verschwindet im Flausch 🥰';
    answerTarget   = '';
    globalCooldown = 0;
    customHandler  = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        sayService.say(origin, context['display-name'], '', channel, this.answerNoTarget);
        emitter.emit('playAudio', {file: 'weird_reverse.mp3', mediaType: 'audio', volume: 0.5});
    };
}

let lurkCommand = new LurkCommand();

export default lurkCommand;