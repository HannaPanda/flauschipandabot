import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import knochenCommand from "./KnochenCommand";
import Fighter from "../Models/Fighter";
dotenv.config({ path: __dirname+'/../.env' });

class PflasterCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'pflaster';
    description    = 'Macht Aua weg ❤';
    answerNoTarget = '';
    answerTarget   = '';

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const targetName = parts.slice(1).join(' ');
        const target = this.getTarget(origin, parts, messageObject);

        if(parts.length > 1 && target !== '') {
            let text = `${context['display-name']} pustet auf das Aua von ${targetName} und tut ein Pflaster drauf. ${targetName} ist vollständig geheilt SeemsGood`;

            const originUser = new Fighter();
            await originUser.init(context.username.toLowerCase());

            const targetUser = new Fighter();
            await targetUser.init(target);

            originUser.setOpponent(targetUser);

            if(targetUser.get('curHp') === targetUser.get('maxHp')) {
                emitter.emit(`${origin}.say`, `${targetName} ist bereits vollständig geheilt`, channel);
                return Promise.resolve(false);
            }

            await targetUser.set('curHp', targetUser.get('maxHp')).update();
            const xpGained = originUser.calculateXPGained() * 4;

            const convertedLevel = originUser.calculateLevel();

            if(await originUser.checkLevelUp()) {
                text = text + ` [${context['display-name']}: +${xpGained.toLocaleString('de-DE')} XP | LVL ${convertedLevel}]`;
            } else {
                text = text + ` [${context['display-name']}: +${xpGained.toLocaleString('de-DE')} XP]`;
            }

            emitter.emit(`${origin}.say`, text, channel);
        } else {
            emitter.emit(
                `${origin}.say`,
                `${context['display-name']} bappt sich selbst ein Pflaster auf die Stirn LUL`,
                channel
            );

            const user = new Fighter();
            await user.init(context.username.toLowerCase());
            await user.set('curHp', user.get('maxHp')).update();
        }

        return Promise.resolve(true);
    }
}

let pflasterCommand = new PflasterCommand();

export default pflasterCommand;