import AbstractCommand from "../Abstracts/AbstractCommand";
import Fighter from "../Models/Fighter";
import sayService from "../Services/SayService";

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

    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const username = context.userName;

        const originUser = new Fighter();
        await originUser.init(username);

        if(originUser.get('xp') >= 500000) {
            const text = `###ORIGIN###: Du hast dir erfolgreich 5% Immunität für 500.000XP gekauft. Du bist damit auf ${originUser.get('immunity')+5}% Immunität.`;
            sayService.say(origin, context.displayName, '', channel, text);

            await originUser
                .set('immunity', originUser.get('immunity') + 5)
                .set('xp', originUser.get('xp') - 500000)
                .update();
        } else {
            // Nicht genug Erfahrungspunkte
            const text = `###ORIGIN###: Du hast nicht genug Erfahrungspunkte, um 5% Immunität zu kaufen!`
            sayService.say(origin, context.displayName, '', channel, text);
        }

        return Promise.resolve(true);
    }
}

let healCommand = new HealCommand();

export default healCommand;
