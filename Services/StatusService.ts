import Fighter from "../Models/Fighter";
import sayService from "./SayService";
import mongoDBClient from "../Clients/mongoDBClient";

class StatusService
{
    private interval;

    constructor() {
        this.interval = setInterval(this.intervalFunc, 300000);
    }

    private intervalFunc = async () => {
        const diseasedFighters = await mongoDBClient
            .db("flauschipandabot")
            .collection("fighters")
            .find({$or: [{disease: true}, {incurableDisease: true}]}, {})
            .toArray();

        if(diseasedFighters.length > 0) {
            const text = `Folgende Chatter nehmen durch Krankheit Schaden: ${diseasedFighters.map(elem => { return elem.name }).join(', ')}`;
            sayService.say('tmi', '', '', null, text);

            let faintedUsers = [];

            for(let i = 0; i < diseasedFighters.length; i++) {
                const username = diseasedFighters[i].name;
                const targetUser = new Fighter();
                targetUser.initByObject(diseasedFighters[i]);

                const damage = Math.min(targetUser.get('curHp'), Math.max(1, Math.floor(targetUser.get('maxHp') / 10)));
                const newHp  = Math.max(0, targetUser.get('curHp') - damage);

                if(newHp <= 0) {
                    faintedUsers.push(username);
                    await targetUser.set('curHp', newHp).set('disease', false).set('incurableDisease', false).update();
                } else {
                    await targetUser.set('curHp', newHp).update();
                }
            }

            if(faintedUsers.length > 0) {
                const text = `Folgende Chatter sind auf 0HP gefallen und ohnmächtig geworden: ${faintedUsers.join(', ')}`;
                sayService.say('tmi', '', '', null, text);
            }
        }
    }

    public addKrankheit = async (targetUser: Fighter, targetName, origin, channel) => {
        if(!targetUser.get('disease')) {
            await targetUser.set('disease', true).update();
        } else {
            sayService.say(origin, '', '', channel, `${targetName} ist bereits von einer Krankheit betroffen.`);
        }
    }

    public addUnheilbareKrankheit = async (targetUser: Fighter, targetName, origin, channel) => {
        if(!targetUser.get('incurableDisease')) {
            await targetUser.set('incurableDisease', true).update();
        } else {
            sayService.say(origin, '', '', channel, `${targetName} ist bereits von einer Krankheit betroffen.`);
        }
    }

    public heileKrankheit = async (displayName, originUser: Fighter, targetUser: Fighter, targetName, origin, channel) => {
        if(targetUser.get('disease')) {
            if(originUser.get('xp') >= 10000) {
                await targetUser.set('disease', false).update();

                sayService.say(origin, '', '', channel, `${displayName} verbraucht 10.000XP und heilt ${targetName} von einer Krankheit SeemsGood`);

                await originUser.set('xp', originUser.get('xp') - 10000).update();
            } else {
                sayService.say(origin, '', '', channel, `${displayName} versucht ${targetName} zu heilen, hat aber nicht die benötigten 10.000XP übrig!`);
            }
        } else {
            sayService.say(origin, '', '', channel, `${displayName} versucht ${targetName} zu heilen, aber ${targetName} ist gar nicht krank!`);
        }
    }
}

const statusService = new StatusService();

export default statusService;
