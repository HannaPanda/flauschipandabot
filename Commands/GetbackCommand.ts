import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import knochenCommand from "./KnochenCommand";
import Fighter from "../Models/Fighter";
import mongoDBClient from "../Clients/mongoDBClient";
import server from "../server";
dotenv.config({ path: __dirname+'/../.env' });

class GetbackCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = true;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'getback';
    aliases        = [];
    description    = 'Verringert den Verpiss Dich Counter um 1';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 3;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const numberPattern = /\d+/g;
        const numbers = parts.slice(1).join(' ').match( numberPattern );
        const number = (numbers) ? numbers.join('') : '';

        const numberOfVerpissdichToAdd = (number !== '' && parseInt(number) > 0) ? parseInt(number) : 1;

        const document = await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .findOne( {identifier: 'verpissdichCounter'}, {});

        const verpissdichCounter = (document && document.value) ? document.value : 0;
        const newVerpissdichCounter = Math.max(verpissdichCounter - numberOfVerpissdichToAdd, 0);

        await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .updateOne(
                {identifier: 'verpissdichCounter'},
                {$set: {value: newVerpissdichCounter}},
                {upsert: true}
            )
        server.getIO().emit('verpissdichCounterChanged', newVerpissdichCounter);

        return Promise.resolve(true);
    }
}

let getbackCommand = new GetbackCommand();

export default getbackCommand;