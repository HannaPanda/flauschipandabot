import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import {DiceRoll} from "@dice-roller/rpg-dice-roller";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class KnochenCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = true;
    command        = 'knochen';
    description    = 'Wirf mit einem Knochen!';
    answerNoTarget = '###ORIGIN### wirft mit Knochen um sich 🦴🦴';
    answerTarget   = '###ORIGIN### wirft einen Knochen auf ###TARGET### 🦴';
    globalCooldown = 0;

    targetAreas = [
        'am Kopf, das gibt \'ne Beule', 'ins Auge, AUA', 'am Bauch, boing', 'an der Hand', 'am Arm', 'am Fuß',
        'am Knie, das war\'s mit dem Abenteurer-Leben', 'am Knöchel', 'am kleinen Finger', 'an der Hüfte', 'am Ohr',
        'direkt auf den Mund, das gibt \'ne dicke Lippe', 'am Musikantenknochen, AAHHHHHH', 'am großen Onkel',
        'voll auf die Nase, wie das zeckt', 'ganz tief in der Seele, das tut jetzt richtig weh'
    ];

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const fetch = require('node-fetch');
        const chatterInfo = await fetch(`https://tmi.twitch.tv/group/user/${process.env.CHANNEL}/chatters`, {method: "Get"})
            .then(res => res.json())
            .catch(err => {console.log(err)});

        const target = this.getTarget(origin, parts, messageObject);
        const username = context.username.toLowerCase();

        if(chatterInfo && chatterInfo.chatters && target !== '') {
            const chatters = [].concat(...Object.values(chatterInfo.chatters));
            const targetName = parts.slice(1).join(' ');

            if(target === 'flauschipandabot') {
                sayService.say(origin, '', '', channel, `Öi! ಠ_ಠ`);
                return Promise.resolve(true);
            }

            const originUser = new Fighter();
            await originUser.init(username);

            const targetUser = new Fighter();
            await targetUser.init(target);

            originUser.setOpponent(targetUser);

            if(targetUser.get('curHp') <= 0) {
                sayService.say(origin, '', targetName, channel, `###TARGET### ist doch schon ohnmächtig!`);
                return Promise.resolve(false);
            }

            const levelDifference = originUser.calculateLevelDifference();
            const hitChance = 62 + Math.max(0, (levelDifference * 2));
            const hasHit = hitChance > this.randomInt(1, 100) && !targetUser.isImmune();
            const damage = new DiceRoll(`${Math.max(1, Math.floor(originUser.get('level')/4))}d2`).total;
            const newHp  = Math.max(0, targetUser.get('curHp') - damage);

            if(hasHit) {
                const hitArea = this.targetAreas[this.randomInt(0, this.targetAreas.length - 1)];
                let text = `${context['display-name']} wirft einen Knochen und trifft ${targetName} ${hitArea} 🦴.`;

                const xpGained = originUser.calculateXPGained();
                const convertedLevel = originUser.calculateLevel();

                if(await originUser.checkLevelUp()) {
                    text = text + ` [${context['display-name']}: +${xpGained.toLocaleString('de-DE')} XP | LVL ${convertedLevel}]`;
                } else {
                    text = text + ` [${context['display-name']}: +${xpGained.toLocaleString('de-DE')} XP]`;
                }

                text = text + ` [${targetName}: ${damage} DMG | HP ${newHp}/${targetUser.get('maxHp')}]`;

                sayService.say(origin, '', '', channel, text);
                if(newHp <= 0) {
                    sayService.say(origin, '', targetName, channel, `###TARGET### ist auf 0HP und fällt ohnmächtig um.`);
                }

                await targetUser.set('curHp', newHp).update();
            } else {
                const epicFail = this.randomInt(1, 20);
                if(epicFail === 1) {
                    let accidentalTargetUser = await mongoDBClient
                        .db("flauschipandabot")
                        .collection("fighters")
                        .aggregate([{$match: {name: { $in: chatters, $ne: target }}}, { $sample: { size: 1 } }])
                        .next();

                    if(accidentalTargetUser.name === username) {
                        const text = `${context['display-name']} wirft einen Knochen, verfehlt ${targetName} spektakulär und trifft sich stattdessen selber NotLikeThis NotLikeThis NotLikeThis LUL LUL LUL`;
                        sayService.say(origin, '', '', channel, text);
                    } else if(accidentalTargetUser) {
                        const text = `${context['display-name']} wirft einen Knochen, verfehlt ${targetName} spektakulär und trifft stattdessen ${accidentalTargetUser.name} NotLikeThis`;
                        sayService.say(origin, '', '', channel, text);
                    } else {
                        const text = `${context['display-name']} wirft einen Knochen und verfehlt ${targetName} spektakulär LUL`;
                        sayService.say(origin, '', '', channel, text);
                    }
                } else {
                    const text = `${context['display-name']} wirft einen Knochen und verfehlt ${targetName} LUL`;
                    sayService.say(origin, '', '', channel, text);
                }
            }

            return Promise.resolve(true);
        }

        if(parts.length > 1 && this.answerTarget !== '') {
            sayService.say(origin, context['display-name'], parts.slice(1).join(' '), channel, this.answerTarget);
        } else {
            sayService.say(origin, context['display-name'], parts.slice(1).join(' '), channel, this.answerNoTarget);
        }

        return Promise.resolve(true);
    }
}

let knochenCommand = new KnochenCommand();

export default knochenCommand;