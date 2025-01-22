import AbstractCommand from "../Abstracts/AbstractCommand";
import Fighter from "../Models/Fighter";
import sayService from "../Services/SayService";
import moment from "moment";

class SchlafblumenCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'schlafblumen';
    description    = 'Bringe jemanden zum Schlafen';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 600;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {

        const target = this.getTarget(origin, parts, messageObject);
        const username = context.userName;
        const targetName = parts.slice(1).join(' ');

        if(targetName === '') {
            const text = `###ORIGIN### schmeißt mit Blüten um sich`;
            sayService.say(origin, context.displayName, targetName, channel, text);
        } else {
            const targetUser = new Fighter();
            await targetUser.init(target);

            if(targetUser.get('disease') || targetUser.get('incurableDisease')) {
                sayService.say(origin, context.displayName, targetName, channel, `###TARGET### leidet unter einer Krankheit und reagiert nicht auf die Schlafblumen!`);
                return false;
            }

            await targetUser.set('isAsleepUntil', moment().add(5, 'minutes').format()).set('curHp', targetUser.get('maxHp')).update();

            const text = `###ORIGIN### streut eine Hand voll Schlafblumen auf ###TARGET###. ###TARGET### fällt für 5 Minuten in einen flauschigen Schlaf und wird dabei voll geheilt. emote_sleep emote_sleep emote_sleep emote_sleep `;
            sayService.say(origin, context.displayName, targetName, channel, text);
        }

        return Promise.resolve(true);
    }
}

let schlafblumenCommand = new SchlafblumenCommand();

export default schlafblumenCommand;
