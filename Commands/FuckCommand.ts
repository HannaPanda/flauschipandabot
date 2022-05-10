import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import knochenCommand from "./KnochenCommand";
import Fighter from "../Models/Fighter";
import mongoDBClient from "../Clients/mongoDBClient";
dotenv.config({ path: __dirname+'/../.env' });

class FuckCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = true;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'fuck';
    aliases        = [];
    description    = 'Erhöht den Fuck Counter um 1';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 3;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const numberPattern = /\d+/g;
        const numbers = parts.slice(1).join(' ').match( numberPattern );
        const number = (numbers) ? numbers.join('') : '';

        const numberOfFucksToAdd = (number !== '' && parseInt(number) > 0) ? parseInt(number) : 1;

        emitter.emit('playAudio', {file: 'quack.mp3', mediaType: 'audio', volume: 0.2});

        const document = await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .findOne( {identifier: 'fuckCounter'}, {});

        const fuckCounter = (document && document.value) ? document.value : 0;
        const newFuckCounter = fuckCounter + numberOfFucksToAdd;

        await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .updateOne(
                {identifier: 'fuckCounter'},
                {$set: {value: newFuckCounter}},
                {upsert: true}
            )
        emitter.emit('fuckCounterChanged', newFuckCounter);

        return Promise.resolve(true);
    }
}

let fuckCommand = new FuckCommand();

export default fuckCommand;