import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class HypeCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = true;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'say';
    description    = 'Lass den Bot etwas sagen';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        emitter.emit('bot.say', parts.slice(1).join(' '));
    }
}

let hypeCommand = new HypeCommand();

export default hypeCommand;