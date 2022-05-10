import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import moment from "moment";
dotenv.config({ path: __dirname+'/../.env' });

class Fighter {

    private fighter;
    private opponent;
    private dirty = [];

    xpToLevel = {
        0: 1, 300: 2, 900: 3, 2700: 4, 6500: 5, 14000: 6, 23000: 7, 34000: 8, 48000: 9, 64000: 10, 85000: 11,
        100000: 12, 120000: 13, 140000: 14, 165000: 15, 195000: 16, 225000: 17, 265000: 18, 305000: 19, 355000: 20
    }

    initByObject = (fighter: object) => {
        this.fighter = fighter;
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
                    curHp: hp,
                    immunity: 0,
                    canUseCommands: true,
                    disease: false,
                    incurableDisease: false,
                    inLoveWith: [],
                    isAsleepUntil: moment().subtract(1, 'year').format()
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
        this.dirty.push(stat);
        this.fighter[stat] = value;

        return this;
    }

    get = (stat: string) => {
        return this.fighter[stat];
    }

    update = async () => {
        if(this.dirty.length === 0) {
            return Promise.resolve(false);
        }

        let updateObject = {};
        for(let i = 0; i < this.dirty.length; i++) {
            updateObject[this.dirty[i]] = this.fighter[this.dirty[i]];
        }

        await mongoDBClient
            .db("flauschipandabot")
            .collection("fighters")
            .updateOne(
                {name: this.fighter.name},
                {$set: updateObject}
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

    isImmune = () => {
        return this.get('immunity') > this.randomInt(0, 100);
    }
}

export default Fighter;