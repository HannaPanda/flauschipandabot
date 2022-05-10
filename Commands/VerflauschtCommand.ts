import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class VerflauschtCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'verflauscht';
    description    = 'Wie verflauscht bist du?';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const targetName = parts.slice(1).join(' ');
        const displayName = context['display-name'];
        const percentage = this.randomInt(0, 100);

        let additionalText = '';
        if(percentage === 0) {
            additionalText = ', das wird wohl nichts emote_stinky';
        } else if(percentage < 50) {
            additionalText = ', sieht schlecht aus emote_bleed';
        } else if(percentage >= 50 && percentage < 90) {
            additionalText = ', das könnte noch was geben emote_unity';
        } else if(percentage >= 90) {
            additionalText = ', oh lala emote_heart';
        }

        let text = `###ORIGIN### ist ${percentage}% verflauscht in ###TARGET###` + additionalText;

        sayService.say(origin, displayName, targetName, channel, text);
    }
}

let verflauschtCommand = new VerflauschtCommand();

export default verflauschtCommand;