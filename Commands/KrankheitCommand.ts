import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import statusService from "../Services/StatusService";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

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
        const username = context.username.toLowerCase();
        const targetName = parts.slice(1).join(' ');

        const originUser = new Fighter();
        await originUser.init(username);

        if(target.trim() === '') {
            const text = `${context['display-name']} fuchtelt theatralisch in der Luft herum und... es passiert nichts LUL`;
            sayService.say(origin, context['display-name'], '', channel, text);
            return Promise.resolve(false);
        }

        const targetUser = new Fighter();
        await targetUser.init(target);

        originUser.setOpponent(targetUser);

        const randomNumber = this.randomInt(1, 100);

        if(targetUser.isImmune()) {
            // Immunität ausgelöst
            const text = `${context['display-name']} fuchtelt theatralisch in der Luft herum aber ${targetName} ist immun! LUL`;
            sayService.say(origin, context['display-name'], '', channel, text);
        } else if(randomNumber >= 1 && randomNumber <= 20) {
            // Beide getroffen
            await Promise.all([
                statusService.addKrankheit(originUser, context['display-name'], origin, channel),
                statusService.addKrankheit(targetUser, targetName, origin, channel)
            ]);

            const text = `${context['display-name']} verhext ${targetName} mit einer Krankheit. Dabei ist aber etwas schief gegangen und ${context['display-name']} erwischt es auch! NotLikeThis`;
            sayService.say(origin, context['display-name'], '', channel, text);

        } else if(randomNumber >= 21 && randomNumber <= 40) {
            // Nur origin getroffen
            await statusService.addKrankheit(originUser, context['display-name'], origin, channel);

            const text = `${context['display-name']} verhext sich selbst beim Versuch, ${targetName} mit einer Krankheit zu verhexen! NotLikeThis`;
            sayService.say(origin, context['display-name'], '', channel, text);
        } else if(randomNumber >= 41 && randomNumber <= 45) {
            // Nichts passiert

            const text = `${context['display-name']} fuchtelt theatralisch in der Luft herum und... es passiert nichts LUL`;
            sayService.say(origin, context['display-name'], '', channel, text);
        } else {
            // Target getroffen
            await statusService.addKrankheit(targetUser, targetName, origin, channel);

            const xpGained = originUser.calculateXPGained();
            const convertedLevel = originUser.calculateLevel();

            let text = `${context['display-name']} verhext ${targetName} mit einer Krankheit!`;
            if(await originUser.checkLevelUp()) {
                text = text + ` [${context['display-name']}: +${xpGained.toLocaleString('de-DE')} XP | LVL ${convertedLevel}]`;
            } else {
                text = text + ` [${context['display-name']}: +${xpGained.toLocaleString('de-DE')} XP]`;
            }

            sayService.say(origin, context['display-name'], '', channel, text);
        }

        return Promise.resolve(true);
    }
}

let krankheitCommand = new KrankheitCommand();

export default krankheitCommand;