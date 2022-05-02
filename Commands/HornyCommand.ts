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
    isAggressive   = false;
    command        = 'horny';
    aliases        = ['!bonk'];
    description    = 'Horny Bonk';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

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
                );
            emitter.emit('hornyLevelChanged', curHornyLevel);
        }, 300000);
    }

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const document = await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .findOne( {identifier: 'hornyLevel'}, {});

        emitter.emit('showImage', {file: 'horny.png', mediaType: 'image', duration: 5000});
        emitter.emit('playAudio', {file: 'bonk.mp3', mediaType: 'audio', volume: 0.2});

        const curHornyLevel = (document && document.value) ? document.value : 0;
        if(curHornyLevel >= 100) {
            return Promise.resolve(true);
        }

        let newHornyLevel = Math.min(100, (curHornyLevel + 10));

        await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .updateOne(
                {identifier: 'hornyLevel'},
                {$set: {value: newHornyLevel}},
                {upsert: true}
            )
        emitter.emit('hornyLevelChanged', newHornyLevel);

        return Promise.resolve(true);
    }
}

let hornyCommand = new HornyCommand();

export default hornyCommand;