import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import mongoDBClient from "../Clients/mongoDBClient";

class InfoCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'info';
    aliases        = [];
    description    = 'Hintergrundinfos für den Bot';
    answerNoTarget = ``;
    answerTarget   = '';
    globalCooldown = 0;
    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        /*sayService.say(origin, '', '', channel, this.answerNoTarget);*/

        let user = await mongoDBClient
            .db("flauschipandabot")
            .collection("users")
            .findOne({name: context.userName}, {});

        if(!user) {
            await mongoDBClient
                .db("flauschipandabot")
                .collection("users")
                .insertOne({name: context.userName, info: ''});
        }

        user = await mongoDBClient
            .db("flauschipandabot")
            .collection("users")
            .findOne({name: context.userName}, {});

        if(parts.length <= 1) {
            sayService.say(origin, '', '', channel, `@${context.userName} Deine hinterlegte Info ist '${user?.info}'`);
        } else {

            await mongoDBClient
                .db("flauschipandabot")
                .collection("users")
                .updateOne(
                    {name: context.userName},
                    {$set: {info: parts.slice(1).join(' ')}},
                    {upsert: true}
                );

            sayService.say(origin, '', '', channel, `@${context.userName} Deine hinterlegte Info ist '${parts.slice(1).join(' ')}'`);
        }
    };
}

let infoCommand = new InfoCommand();

export default infoCommand;
