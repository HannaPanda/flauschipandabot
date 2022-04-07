import * as dotenv from "dotenv";
import Fighter from "../Models/Fighter";
import emitter from "../emitter";
dotenv.config({ path: __dirname+'/../.env' });

class StatusService
{
    private krankheiten = {};

    public addKrankheit = async (targetUser: Fighter, targetName, origin, channel) => {
        if(!(targetUser.get('name') in this.krankheiten)) {
            this.krankheiten[targetUser.get('name')] = setInterval(() => {
                const damage = Math.min(targetUser.get('curHp'), Math.max(1, Math.floor(targetUser.get('maxHp') / 10)));
                const newHp  = Math.max(0, targetUser.get('curHp') - damage);

                emitter.emit(
                    `${origin}.say`,
                    `${targetName} nimmt ${damage} Schaden durch eine Krankheit. [HP ${newHp}/${targetUser.get('maxHp')}]`,
                    channel
                );
                targetUser.set('curHp', newHp).update().then(() => {
                    if(targetUser.get('curHp') <= 0) {
                        emitter.emit(
                            `${origin}.say`,
                            `${targetName} fällt ohnmächtig um. Die Krankheit verschwindet.`,
                            channel
                        );
                        clearInterval(this.krankheiten[targetUser.get('name')]);
                        delete this.krankheiten[targetUser.get('name')];
                    }
                });
            }, 300000);
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