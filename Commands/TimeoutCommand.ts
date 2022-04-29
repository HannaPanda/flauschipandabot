import emitter from "../emitter";
import tmiClient from "../Clients/tmiClient";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class TimeoutCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = true;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'to';
    description    = 'Sende jemanden in timeout';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        if(!/!to/i.test(message)) {
            return Promise.resolve(false);
        }

        if(!context.mod && context.username !== process.env.CHANNEL) {
            emitter.emit('tmi.say', `*bonk* ಠ_ಠ`);
            return Promise.resolve(false);
        }

        if(parts.length > 1) {
            tmiClient.timeout(process.env.CHANNEL, parts[1], 300, parts[1]+' war unartig! ┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻').catch((err) => {console.warn(err)});
        } else {
            emitter.emit('tmi.say', `Wen bitte? ಠ_ಠ`);
        }

        return Promise.resolve(true)
    }
}

let timeoutCommand = new TimeoutCommand();

export default timeoutCommand;