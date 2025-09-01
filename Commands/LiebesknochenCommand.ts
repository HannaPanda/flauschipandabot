import AbstractCommand from "../Abstracts/AbstractCommand";
import Fighter from "../Models/Fighter";
import {DiceRoll} from "@dice-roller/rpg-dice-roller";
import sayService from "../Services/SayService";
import { Env } from "../Config/Environment";

class LiebesknochenCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'liebesknochen';
    description    = 'Wirf einen Liebesknochen, heile dein Ziel ein wenig und lass sie sich in dich verlieben emote_heart';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const fetch = require('node-fetch');
        const chatterInfo = await fetch(`https://tmi.twitch.tv/group/user/${Env.channel}/chatters`, {method: "Get"})
            .then(res => res.json())
            .catch(err => {console.log(err)});

        const target = this.getTarget(origin, parts, messageObject);
        const username = context.userName;

        if(target === '') {
            const text = `###ORIGIN### wirft mit Liebesknochen um sich emote_heart`;
            sayService.say(origin, context.displayName, '', channel, text);

            return Promise.resolve(true);
        }

        const targetName = parts.slice(1).join(' ');

        const originUser = new Fighter();
        await originUser.init(username);

        const targetUser = new Fighter();
        await targetUser.init(target);

        originUser.setOpponent(targetUser);

        if(targetUser.get('disease') || targetUser.get('incurableDisease')) {
            sayService.say(origin, context.displayName, targetName, channel, `###TARGET### leidet unter einer Krankheit und reagiert nicht auf den Liebesknochen!`);
            return false;
        }

        const damageHealed = new DiceRoll(`${Math.max(1, Math.floor(originUser.get('level')/4))}d2`).total;
        const newHp = Math.min(targetUser.get('maxHp'), targetUser.get('curHp') + damageHealed);

        await targetUser.set('curHp', newHp).update();

        const text = `###ORIGIN### wirft mit Liebesknochen auf ###TARGET### emote_heart ###TARGET### wird um ${damageHealed} HP geheilt und schaut jetzt ###ORIGIN### ganz verliebt an emote_heart emote_woah`;
        sayService.say(origin, context.displayName, targetName, channel, text);

        return Promise.resolve(true);
    }
}

let liebesknochenCommand = new LiebesknochenCommand();

export default liebesknochenCommand;
