import emitter from "../emitter";
import * as dotenv from "dotenv";
import mongoDBClient from "../Clients/mongoDBClient";
import tmiClient from "../Clients/tmiClient";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class FlauschlisteCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'flauschliste';
    description    = 'Zeigt an, wer die meisten Flauschen im Kopf hat';
    answerNoTarget = '';
    answerTarget   = '';

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const userList = await mongoDBClient
            .db("flauschipandabot")
            .collection("flausch_users")
            .find({}, {sort: {times: "desc"}})
            .limit(5);

        emitter.emit(`${origin}.say`, `Wer hat die meisten Flauschen im Kopf? ヽ(゜∇゜)ノ`, channel);
        let platz = 1;
        await userList.forEach((document) => {
            emitter.emit(`${origin}.say`, `Platz ${platz++}: ${document.name} mit ${document.times} Flauschen`, channel);
        });

        return Promise.resolve(true)
    }
}

let flauschlisteCommand = new FlauschlisteCommand();

export default flauschlisteCommand;