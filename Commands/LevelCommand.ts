import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
dotenv.config({ path: __dirname+'/../.env' });

class LevelCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'level';
    description    = 'Level, Erfahrung und Lebenspunkte';
    answerNoTarget = '';
    answerTarget   = '';

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const username = context.username.toLowerCase();

        const target = this.getTarget(origin, parts, messageObject);
        const targetName = parts.slice(1).join(' ');

        let fighter, name;
        if(target) {
            name = targetName;

            fighter = new Fighter();
            await fighter.init(target);
        } else {
            name = context['display-name'];

            fighter = new Fighter();
            await fighter.init(username);
        }

        const text = `${name}: LVL ${fighter.get('level')} | XP ${fighter.get('xp').toLocaleString('de-DE')} | HP ${fighter.get('curHp')}/${fighter.get('maxHp')} | Immunität ${fighter.get('immunity')}%`;

        this.say(origin, '', '', channel, text);

        return Promise.resolve(true);
    }
}

let levelCommand = new LevelCommand();

export default levelCommand;