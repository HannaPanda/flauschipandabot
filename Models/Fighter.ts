import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });

class Fighter {

    private fighter;

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
}

export default Fighter;