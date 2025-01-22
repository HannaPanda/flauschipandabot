import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import server from "../server";

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
        server.getIO().emit('playAudio', {file: 'pretzels.mp3', mediaType: 'audio', volume: 0.5});
    };
}

let brezelCommand = new BrezelCommand();

export default brezelCommand;
