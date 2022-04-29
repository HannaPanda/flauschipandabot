import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import statusService from "../Services/StatusService";
import StatusService from "../Services/StatusService";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class HealCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'immunsystem';
    description    = 'Hol dir 5% Immunität für 500.000XP';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const username = context.username.toLowerCase();

        const originUser = new Fighter();
        await originUser.init(username);

        if(originUser.get('xp') >= 500000) {
            const text = `###ORIGIN###: Du hast dir erfolgreich 5% Immunität für 500.000XP gekauft. Du bist damit auf ${originUser.get('immunity')+5}% Immunität.`;
            sayService.say(origin, context['display-name'], '', channel, text);

            await originUser
                .set('immunity', originUser.get('immunity') + 5)
                .set('xp', originUser.get('xp') - 500000)
                .update();
        } else {
            // Nicht genug Erfahrungspunkte
            const text = `###ORIGIN###: Du hast nicht genug Erfahrungspunkte, um 5% Immunität zu kaufen!`
            sayService.say(origin, context['display-name'], '', channel, text);
        }

        return Promise.resolve(true);
    }
}

let healCommand = new HealCommand();

export default healCommand;