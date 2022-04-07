import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });

class Fighter {

    private fighter;
    private opponent;

    // 0.0000505178 x + 5.07337
    /*
        After lvl 12 it is a bit more structurized
        12-13. +20k
        13-14. +20k
        14-15. +25k
        15-16. +30k
        16-17. +30k
        17-18. +40k
        18-19. +40k
        19-20. +50k
        20-21. +50k
        21-22. +60k
        22-23. +60k
     */
    xpToLevel = {
        0: 1, 300: 2, 900: 3, 2700: 4, 6500: 5, 14000: 6, 23000: 7, 34000: 8, 48000: 9, 64000: 10, 85000: 11,
        100000: 12, 120000: 13, 140000: 14, 165000: 15, 195000: 16, 225000: 17, 265000: 18, 305000: 19, 355000: 20
    }

    init = async (name: string) => {
        this.fighter = await mongoDBClient
            .db("flauschipandabot")
            .collection("fighters")
            .findOne({name: name}, {});

        if(!this.fighter) {
            let hp = this.randomInt(4, 8);
            await mongoDBClient
                .db("flauschipandabot")
                .collection("fighters")
                .insertOne({
                    name: name,
                    level: 1,
                    xp: 0,
                    maxHp: hp,
                    curHp: hp
                });

            this.fighter = await mongoDBClient
                .db("flauschipandabot")
                .collection("fighters")
                .findOne({name: name}, {});
        }

        return Promise.resolve(true);
    }

    setOpponent = (opponent) => {
        this.opponent = opponent;
    }

    set = (stat: string, value: any) => {
        this.fighter[stat] = value;

        return this;
    }

    get = (stat: string) => {
        return this.fighter[stat];
    }

    update = async () => {
        await mongoDBClient
            .db("flauschipandabot")
            .collection("fighters")
            .updateOne(
                {name: this.fighter.name},
                {
                    $set: {
                        xp:    this.fighter.xp,
                        level: this.fighter.level,
                        curHp: this.fighter.curHp,
                        maxHp: this.fighter.maxHp
                    }
                }
            );
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    calculateLevelDifference = () => {
        return this.get('level') - this.opponent.get('level');
    }

    calculateXPGained = () => {
        return 50 * ((this.opponent.get('level') + 1) ** 2);
    }

    calculateNewTotalXP = () => {
        return this.get('xp') + this.calculateXPGained();
    }

    calculateLevel = () => {
        const newTotalXP = this.calculateNewTotalXP();
        const xpToLevel = this.xpToLevel[((Object.keys(this.xpToLevel)).filter(function(value){return value < newTotalXP;})).pop()]

        if(newTotalXP < 410000) {
            return xpToLevel;
        } else {
            let levelXpCalc = 355000;
            let additionalLevels = 0;
            while(levelXpCalc <= newTotalXP) {
                levelXpCalc += 50000 + (5000 * (additionalLevels + 1));
                if(levelXpCalc <= newTotalXP) {
                    additionalLevels++;
                }
            }

            return xpToLevel + additionalLevels;
        }
    }

    checkLevelUp = async () => {
        const levelUp =  this.calculateLevel() > this.get('level');
        if(levelUp) {
            const hpGained = this.randomInt(4, 8);
            await this
                .set('xp', this.calculateNewTotalXP())
                .set('level', this.calculateLevel())
                .set('curHp', this.get('maxHp') + hpGained)
                .set('maxHp', this.get('maxHp') + hpGained)
                .update();
        } else {
            await this
                .set('xp', this.calculateNewTotalXP())
                .update();
        }
        return Promise.resolve(levelUp);
    }
}

export default Fighter;