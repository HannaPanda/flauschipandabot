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
    command        = 'pflaster';
    description    = 'Macht Aua weg ❤';
    answerNoTarget = '';
    answerTarget   = '';

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const targetName = parts.slice(1).join(' ');
        const target = this.getTarget(origin, parts, messageObject);

        if(parts.length > 1 && target !== '') {
            emitter.emit(
                `${origin}.say`,
                `${context['display-name']} pustet auf das Aua von ${targetName} und tut ein Pflaster drauf. ${targetName} ist vollständig geheilt SeemsGood`,
                channel
            );

            const user = new Fighter();
            await user.init(target);
            await user.set('curHp', user.get('maxHp')).update();
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