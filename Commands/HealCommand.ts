import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import statusService from "../Services/StatusService";
import StatusService from "../Services/StatusService";
dotenv.config({ path: __dirname+'/../.env' });

class HealCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'heal';
    description    = 'Heile eine Krankheit';
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
            emitter.emit(
                `${origin}.say`,
                `${context['display-name']} versucht jemanden von einer Krankheit zu heilen aber... DA IST NICHTS LUL`,
                channel
            );
            return Promise.resolve(false);
        }

        const targetUser = new Fighter();
        await targetUser.init(target);

        originUser.setOpponent(targetUser);

        await StatusService.heileKrankheit(context['display-name'], originUser, targetUser, targetName, origin, channel);

        return Promise.resolve(true);
    }
}

let healCommand = new HealCommand();

export default healCommand;