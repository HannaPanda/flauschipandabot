import mongoDBClient from "../Clients/mongoDBClient";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";

class FlauschlisteCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'flauschliste';
    description    = 'Zeigt an, wer die meisten Flauschen im Kopf hat';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const userList = await mongoDBClient
            .db("flauschipandabot")
            .collection("flausch_users")
            .find({}, {sort: {times: "desc"}})
            .limit(5);

        sayService.say(origin, '', '', channel, `Wer hat die meisten Flauschen im Kopf? ヽ(゜∇゜)ノ`);
        let platz = 1;
        await userList.forEach((document) => {
            sayService.say(origin, '', '', channel, `Platz ${platz++}: ${document.name} mit ${document.times} Flauschen`);
        });

        return Promise.resolve(true)
    }
}

let flauschlisteCommand = new FlauschlisteCommand();

export default flauschlisteCommand;
