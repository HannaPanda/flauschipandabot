import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
dotenv.config({ path: __dirname+'/../.env' });

class KnochenCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    command        = 'knochen';
    description    = 'Wirf mit einem Knochen!';
    answerNoTarget = '###DISPLAYNAME### wirft mit Knochen um sich 🦴🦴';
    answerTarget   = '###DISPLAYNAME### wirft einen Knochen auf ###TARGET### 🦴';

    xpToLevel = {
        0: 1, 300: 2, 900: 3, 2700: 4, 6500: 5, 14000: 6, 23000: 7, 34000: 8, 48000: 9, 64000: 10, 85000: 11,
        100000: 12, 120000: 13, 140000: 14, 165000: 15, 195000: 16, 225000: 17, 265000: 18, 305000: 19, 355000: 20
    }

    xpByCR = {
        1: 200, 2: 450, 3: 700, 4: 1100, 5: 1800, 6: 2300, 7: 2900, 8: 3900, 9: 5000, 10: 5900, 11: 7200, 12: 8400,
        13: 10000, 14: 11500, 15: 13000, 16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000
    }

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
                emitter.emit(
                    `${origin}.say`,
                    `Öi! ಠ_ಠ`,
                    channel
                );
                return Promise.resolve(true);
            }

            const originUser = new Fighter();
            await originUser.init(username);

            const targetUser = new Fighter();
            await targetUser.init(target);

            const levelDifference = originUser.get('level') - targetUser.get('level');
            const hitChance = 62 + (levelDifference * 2);
            const hasHit = hitChance > this.randomInt(1, 100);
            const damage = Math.max(1, this.randomInt(1, 1 + levelDifference));
            const newHp  = Math.max(0, targetUser.get('curHp') - damage);

            if(hasHit) {
                const hitArea = this.targetAreas[this.randomInt(0, this.targetAreas.length - 1)];
                emitter.emit(
                    `${origin}.say`,
                    `${context['display-name']} wirft einen Knochen und trifft ${targetName} ${hitArea} 🦴`,
                    channel
                );

                const xpGained = this.xpByCR[targetUser.get('level')];
                const newTotalXp = originUser.get('xp') + xpGained;
                const convertedLevel = this.xpToLevel[((Object.keys(this.xpToLevel)).filter(function(value){return value < newTotalXp;})).pop()];

                if(convertedLevel > originUser.get('level')) {
                    emitter.emit(
                        `${origin}.say`,
                        `${context['display-name']} erhält ${xpGained} Erfahrungspunkte und ist jetzt Stufe ${convertedLevel}`,
                        channel
                    );
                    const hpGained = this.randomInt(4, 8);
                    await originUser
                        .set('xp', newTotalXp)
                        .set('level', convertedLevel)
                        .set('curHp', originUser.get('maxHp') + hpGained)
                        .set('maxHp', originUser.get('maxHp') + hpGained)
                        .update();
                } else {
                    emitter.emit(
                        `${origin}.say`,
                        `${context['display-name']} erhält ${xpGained} Erfahrungspunkte`,
                        channel
                    );
                    await originUser.set('xp', newTotalXp).update();
                }

                emitter.emit(
                    `${origin}.say`,
                    `${targetName} nimmt ${damage} Schaden und ist jetzt bei ${newHp} Lebenspunkten`,
                    channel
                );

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
                        emitter.emit(
                            `${origin}.say`,
                            `${context['display-name']} wirft einen Knochen, verfehlt ${targetName} spektakulär und trifft sich stattdessen selber NotLikeThis NotLikeThis NotLikeThis LUL LUL LUL`,
                            channel
                        );
                    } else if(accidentalTargetUser) {
                        emitter.emit(
                            `${origin}.say`,
                            `${context['display-name']} wirft einen Knochen, verfehlt ${targetName} spektakulär und trifft stattdessen ${accidentalTargetUser.name} NotLikeThis`,
                            channel
                        );
                    } else {
                        emitter.emit(
                            `${origin}.say`,
                            `${context['display-name']} wirft einen Knochen und verfehlt ${targetName} spektakulär LUL`,
                            channel
                        );
                    }
                } else {
                    emitter.emit(
                        `${origin}.say`,
                        `${context['display-name']} wirft einen Knochen und verfehlt ${targetName} LUL`,
                        channel
                    );
                }
            }

            return Promise.resolve(true);
        }

        if(parts.length > 1 && this.answerTarget !== '') {
            emitter.emit(
                `${origin}.say`,
                this.answerTarget
                    .split('###DISPLAYNAME###').join(context['display-name'])
                    .split('###TARGET###').join(parts.slice(1).join(' ')),
                channel
            );
        } else {
            emitter.emit(
                `${origin}.say`,
                this.answerNoTarget
                    .split('###DISPLAYNAME###').join(context['display-name'])
                    .split('###TARGET###').join(parts.slice(1).join(' ')),
                channel
            );
        }

        return Promise.resolve(true);
    }
}

let knochenCommand = new KnochenCommand();

export default knochenCommand;