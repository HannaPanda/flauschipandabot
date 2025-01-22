import AbstractCommand from "../Abstracts/AbstractCommand";
import Fighter from "../Models/Fighter";
import statusService from "../Services/StatusService";
import sayService from "../Services/SayService";

class KrankheitCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = true;
    command        = 'krankheit';
    description    = 'Verhexe jemanden mit einer Krankheit';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const target = this.getTarget(origin, parts, messageObject);
        const username = context.userName;
        const targetName = parts.slice(1).join(' ');

        const originUser = new Fighter();
        await originUser.init(username);

        if(target.trim() === '') {
            const text = `${context.displayName} fuchtelt theatralisch in der Luft herum und... es passiert nichts LUL`;
            sayService.say(origin, context.displayName, '', channel, text);
            return Promise.resolve(false);
        }

        const targetUser = new Fighter();
        await targetUser.init(target);

        originUser.setOpponent(targetUser);

        const randomNumber = this.randomInt(1, 100);

        if(targetUser.isImmune()) {
            // Immunität ausgelöst
            const text = `${context.displayName} fuchtelt theatralisch in der Luft herum aber ${targetName} ist immun! LUL`;
            sayService.say(origin, context.displayName, '', channel, text);
        } else if(randomNumber >= 1 && randomNumber <= 20) {
            // Beide getroffen
            await Promise.all([
                statusService.addKrankheit(originUser, context.displayName, origin, channel),
                statusService.addKrankheit(targetUser, targetName, origin, channel)
            ]);

            const text = `${context.displayName} verhext ${targetName} mit einer Krankheit. Dabei ist aber etwas schief gegangen und ${context.displayName} erwischt es auch! NotLikeThis`;
            sayService.say(origin, context.displayName, '', channel, text);

        } else if(randomNumber >= 21 && randomNumber <= 40) {
            // Nur origin getroffen
            await statusService.addKrankheit(originUser, context.displayName, origin, channel);

            const text = `${context.displayName} verhext sich selbst beim Versuch, ${targetName} mit einer Krankheit zu verhexen! NotLikeThis`;
            sayService.say(origin, context.displayName, '', channel, text);
        } else if(randomNumber >= 41 && randomNumber <= 45) {
            // Nichts passiert

            const text = `${context.displayName} fuchtelt theatralisch in der Luft herum und... es passiert nichts LUL`;
            sayService.say(origin, context.displayName, '', channel, text);
        } else {
            // Target getroffen
            await statusService.addKrankheit(targetUser, targetName, origin, channel);

            const xpGained = originUser.calculateXPGained();
            const convertedLevel = originUser.calculateLevel();

            let text = `${context.displayName} verhext ${targetName} mit einer Krankheit!`;
            if(await originUser.checkLevelUp()) {
                text = text + ` [${context.displayName}: +${xpGained.toLocaleString('de-DE')} XP | LVL ${convertedLevel}]`;
            } else {
                text = text + ` [${context.displayName}: +${xpGained.toLocaleString('de-DE')} XP]`;
            }

            sayService.say(origin, context.displayName, '', channel, text);
        }

        return Promise.resolve(true);
    }
}

let krankheitCommand = new KrankheitCommand();

export default krankheitCommand;
