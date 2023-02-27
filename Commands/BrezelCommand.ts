import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class BrezelCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'brezel';
    description    = '🥨';
    answerNoTarget = '🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨 🥨';
    answerTarget   = '';
    globalCooldown = 0;
    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        sayService.say(origin, '', '', channel, this.answerNoTarget);
        emitter.emit('playAudio', {file: 'pretzels.mp3', mediaType: 'audio', volume: 0.5});
    };
}

let brezelCommand = new BrezelCommand();

export default brezelCommand;