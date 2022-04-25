import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import knochenCommand from "./KnochenCommand";
import Fighter from "../Models/Fighter";
import mongoDBClient from "../Clients/mongoDBClient";
dotenv.config({ path: __dirname+'/../.env' });

class HornyCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'horny';
    description    = 'Horny Bonk';
    answerNoTarget = '';
    answerTarget   = '';

    curHornyLevel  = 0;

    constructor() {
        super();

        setInterval(async () => {
            const document = await mongoDBClient
                .db("flauschipandabot")
                .collection("misc")
                .findOne( {identifier: 'hornyLevel'}, {});

            let curHornyLevel = Math.max(0, ((document && document.value) ? document.value : 0) - 1);

            await mongoDBClient
                .db("flauschipandabot")
                .collection("misc")
                .updateOne(
                    {identifier: 'hornyLevel'},
                    {$set: {value: curHornyLevel}},
                    {upsert: true}
                )
            emitter.emit('hornyLevelChanged', curHornyLevel);
        }, 300000);
    }

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const document = await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .findOne( {identifier: 'hornyLevel'}, {});

        let curHornyLevel = Math.min(100, ((document && document.value) ? document.value : 0) + 10);

        await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .updateOne(
                {identifier: 'hornyLevel'},
                {$set: {value: curHornyLevel}},
                {upsert: true}
            )
        emitter.emit('hornyLevelChanged', curHornyLevel);

        return Promise.resolve(true);
    }
}

let hornyCommand = new HornyCommand();

export default hornyCommand;