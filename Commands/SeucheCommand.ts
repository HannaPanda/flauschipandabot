import AbstractCommand from "../Abstracts/AbstractCommand";
import Fighter from "../Models/Fighter";
import statusService from "../Services/StatusService";
import sayService from "../Services/SayService";
import { Env } from "../Config/Environment";

class SeucheCommand extends AbstractCommand
{
    isActive       = false;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = true;
    command        = 'seuche';
    description    = 'Verhexe den ganzen Chat';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        return;
        const username = context.userName;

        const originUser = new Fighter();
        await originUser.init(username);

        const randomNumber = this.randomInt(1, 100);

        const fetch = require('node-fetch');
        const chatterInfo = await fetch(`https://tmi.twitch.tv/group/user/${Env.channel}/chatters`, {method: "Get"})
            .then(res => res.json())
            .catch(err => {console.log(err)});
        const chatters = [].concat(...Object.values(chatterInfo.chatters));

        if(randomNumber >= 1 && randomNumber <= 20) {
            // mit betroffen
            for(let i = 0; i < chatters.length; i++) {
                const fighter = new Fighter();
                await fighter.init(chatters[i]);
                if(!fighter.isImmune()) {
                    await statusService.addKrankheit(fighter, fighter.get('name'), origin, channel);
                }            }
            const text = `###ORIGIN### verhext den ganzen Chat mit einer magischen Seuche. Dummerweise hat es ###ORIGIN### mit erwischt. LUL`;
            sayService.say(origin, context.displayName, '', channel, text);
        } else if(randomNumber >= 21 && randomNumber <= 40) {
            // nichts passiert
            const text = `###ORIGIN### versucht den Chat mit einer magischen Seuche zu verhexen aber scheitert und es passiert... nichts LUL`;
            sayService.say(origin, context.displayName, '', channel, text);
        } else if(randomNumber >= 41 && randomNumber <= 60) {
            // unheilbare krankheit
            await statusService.addUnheilbareKrankheit(originUser, username, origin, channel);

            const text = `###ORIGIN### versucht den Chat mit einer magischen Seuche zu verhexen aber scheitert und verhext sich selbst mit einer unheilbaren Krankheit LUL`;
            sayService.say(origin, context.displayName, '', channel, text);
        } else if(randomNumber >= 61 && randomNumber <= 80) {
            // keine Befehle
            await originUser.set('canUseCommands', false).update();
            setTimeout(() => {
                originUser.set('canUseCommands', true).update();
            }, 600000);

            const text = `###ORIGIN### versucht den Chat mit einer magischen Seuche zu verhexen aber scheitert und kann eine Weile keine Commands mehr ausführen LUL`;
            sayService.say(origin, context.displayName, '', channel, text);
        } else {
            // klappt
            var filteredChatters = chatters.filter(function(e) { return e !== username });
            for(let i = 0; i < filteredChatters.length; i++) {
                const fighter = new Fighter();
                await fighter.init(filteredChatters[i]);
                if(!fighter.isImmune()) {
                    await statusService.addKrankheit(fighter, fighter.get('name'), origin, channel);
                }
            }
            const text = `###ORIGIN### verhext den ganzen Chat mit einer magischen Seuche.`;
            sayService.say(origin, context.displayName, '', channel, text);
        }

        return Promise.resolve(true);
    }
}

let seucheCommand = new SeucheCommand();

export default seucheCommand;
