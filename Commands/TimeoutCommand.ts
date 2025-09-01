import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";

class TimeoutCommand extends AbstractCommand
{
    isActive       = false;
    isModOnly      = true;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'to';
    description    = 'Sende jemanden in timeout';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        if(!/!to/i.test(message)) {
            return Promise.resolve(false);
        }

        if(!context.mod && !context.owner) {
            sayService.say(origin, '', '', channel, `Dieser Befehl ist leider nur für Mods verfügbar`);
            return Promise.resolve(false);
        }

        if(parts.length > 1) {
            //tmiClient.timeout(process.env.CHANNEL, parts[1], 300, parts[1]+' war unartig! ┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻').catch((err) => {console.warn(err)});
        } else {
            sayService.say(origin, '', '', channel, `Wen bitte? ಠ_ಠ`);
        }

        return Promise.resolve(true);
    }
}

let timeoutCommand = new TimeoutCommand();

export default timeoutCommand;
