import AbstractCommand from "../Abstracts/AbstractCommand";
import Fighter from "../Models/Fighter";
import sayService from "../Services/SayService";

class PflasterCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'pflaster';
    description    = 'Macht Aua weg ❤';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const targetName = parts.slice(1).join(' ');
        const target = this.getTarget(origin, parts, messageObject);

        if(parts.length > 1 && target !== '') {
            let text = `${context.displayName} pustet auf das Aua von ${targetName} und tut ein Pflaster drauf. ${targetName} ist vollständig geheilt SeemsGood`;

            const originUser = new Fighter();
            await originUser.init(context.userName);

            const targetUser = new Fighter();
            await targetUser.init(target);

            originUser.setOpponent(targetUser);

            if(targetUser.get('disease') || targetUser.get('incurableDisease')) {
                sayService.say(origin, context.displayName, targetName, channel, `###TARGET### leidet unter einer Krankheit und kann nicht so geheilt werden!`);
                return false;
            }

            if(targetUser.get('curHp') === targetUser.get('maxHp')) {
                sayService.say(origin, context.displayName, targetName, channel, `###TARGET### ist bereits vollständig geheilt`);
                return Promise.resolve(false);
            }

            await targetUser.set('curHp', targetUser.get('maxHp')).update();
            const xpGained = originUser.calculateXPGained() * 4;

            const convertedLevel = originUser.calculateLevel();

            if(await originUser.checkLevelUp()) {
                text = text + ` [${context.displayName}: +${xpGained.toLocaleString('de-DE')} XP | LVL ${convertedLevel}]`;
            } else {
                text = text + ` [${context.displayName}: +${xpGained.toLocaleString('de-DE')} XP]`;
            }

            sayService.say(origin, context.displayName, targetName, channel, text);
        } else {
            sayService.say(origin, context.displayName, targetName, channel, `###ORIGIN### bappt sich selbst ein Pflaster auf die Stirn LUL`);

            const user = new Fighter();
            await user.init(context.userName);
            await user.set('curHp', user.get('maxHp')).update();
        }

        return Promise.resolve(true);
    }
}

let pflasterCommand = new PflasterCommand();

export default pflasterCommand;
