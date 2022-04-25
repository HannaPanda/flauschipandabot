import * as dotenv from "dotenv";
import Fighter from "../Models/Fighter";
import emitter from "../emitter";
import sayService from "./SayService";
dotenv.config({ path: __dirname+'/../.env' });

class StatusService
{
    private krankheiten = {};
    private unheilbareKrankheit = {};

    private interval;

    constructor() {
        this.interval = setInterval(this.intervalFunc, 300000);
    }

    private intervalFunc = async () => {
        if(Object.keys(this.krankheiten).length > 0) {
            const text = `Folgende Chatter nehmen durch Krankheit Schaden: ${Object.keys(this.krankheiten).join(', ')}`;
            sayService.say('tmi', '', '', null, text);

            let faintedUsers = [];

            for(let i = 0; i < Object.keys(this.krankheiten).length; i++) {
                const username = Object.keys(this.krankheiten)[i];
                const targetUser = this.krankheiten[username];

                const damage = Math.min(targetUser.get('curHp'), Math.max(1, Math.floor(targetUser.get('maxHp') / 10)));
                const newHp  = Math.max(0, targetUser.get('curHp') - damage);

                await targetUser.set('curHp', newHp).update();
                if(targetUser.get('curHp') <= 0) {
                    faintedUsers.push(username);
                    delete this.krankheiten[targetUser.get('name')];
                }
            }

            if(faintedUsers.length > 0) {
                const text = `Folgende Chatter sind auf 0HP gefallen und ohnmächtig geworden: ${faintedUsers.join(', ')}`;
                sayService.say('tmi', '', '', null, text);
            }
        }

        if(Object.keys(this.unheilbareKrankheit).length > 0) {
            const text = `Folgende Chatter nehmen durch Krankheit Schaden: ${Object.keys(this.unheilbareKrankheit).join(', ')}`;
            sayService.say('tmi', '', '', null, text);

            let faintedUsers = [];

            for(let i = 0; i < Object.keys(this.unheilbareKrankheit).length; i++) {
                const username = Object.keys(this.unheilbareKrankheit)[i];
                const targetUser = this.unheilbareKrankheit[username];

                const damage = Math.min(targetUser.get('curHp'), Math.max(1, Math.floor(targetUser.get('maxHp') / 10)));
                const newHp  = Math.max(0, targetUser.get('curHp') - damage);

                await targetUser.set('curHp', newHp).update();
                if(targetUser.get('curHp') <= 0) {
                    faintedUsers.push(username);
                    delete this.unheilbareKrankheit[targetUser.get('name')];
                }
            }

            if(faintedUsers.length > 0) {
                const text = `Folgende Chatter sind auf 0HP gefallen und ohnmächtig geworden: ${faintedUsers.join(', ')}`;
                sayService.say('tmi', '', '', null, text);
            }
        }
    }

    public addKrankheit = async (targetUser: Fighter, targetName, origin, channel) => {
        if(!(targetUser.get('name') in this.krankheiten)) {
            this.krankheiten[targetUser.get('name')] = targetUser;
        } else {
            emitter.emit(
                `${origin}.say`,
                `${targetName} ist bereits von einer Krankheit betroffen.`,
                channel
            );
        }
    }

    public addUnheilbareKrankheit = async (targetUser: Fighter, targetName, origin, channel) => {
        if(!(targetUser.get('name') in this.unheilbareKrankheit)) {
            this.unheilbareKrankheit[targetUser.get('name')] = targetUser;
        } else {
            emitter.emit(
                `${origin}.say`,
                `${targetName} ist bereits von einer Krankheit betroffen.`,
                channel
            );
        }
    }

    public heileKrankheit = async (displayName, originUser: Fighter, targetUser: Fighter, targetName, origin, channel) => {
        if(targetUser.get('name') in this.krankheiten) {
            if(originUser.get('xp') >= 10000) {
                clearInterval(this.krankheiten[targetUser.get('name')]);
                delete this.krankheiten[targetUser.get('name')];

                emitter.emit(
                    `${origin}.say`,
                    `${displayName} verbraucht 10.000XP und heilt ${targetName} von einer Krankheit SeemsGood`,
                    channel
                );

                await originUser.set('xp', originUser.get('xp') - 10000).update();
            } else {
                emitter.emit(
                    `${origin}.say`,
                    `${displayName} versucht ${targetName} zu heilen, hat aber nicht die benötigten 10.000XP übrig!`,
                    channel
                );
            }
        } else {
            emitter.emit(
                `${origin}.say`,
                `${displayName} versucht ${targetName} zu heilen, aber ${targetName} ist gar nicht krank!`,
                channel
            );
        }
    }
}

const statusService = new StatusService();

export default statusService;