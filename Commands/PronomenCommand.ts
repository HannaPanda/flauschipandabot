import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import UserModel from "../Models/User";
dotenv.config({ path: __dirname+'/../.env' });

class PronomenCommand extends AbstractCommand {
    isActive = true;
    isModOnly = false;
    isOwnerOnly = false;
    isAggressive = false;
    command = 'pronomen';
    aliases = ['!pronouns'];
    description = 'Pronomen im Chat Hinweis';
    answerNoTarget = `Eure Pronomen im Chat? Geht einfach auf https://pronouns.alejo.io/ und meldet euch über Twitch dort an.
        Dort könnt ihr eure Pronomen auswählen.
        Dazu noch die Browserextension für Chrome: https://pronouns.alejo.io/chrome oder Firefox: https://pronouns.alejo.io/firefox emote_heart emote_heart emote_heart`;
    answerTarget = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        let user = await UserModel.findOne({ username: context.userName });

        if (!user) {
            await new UserModel({ username: context.userName, pronomen: '' }).save();
        }

        user = await UserModel.findOne({ username: context.userName });

        if (parts.length <= 1) {
            sayService.say(origin, '', '', channel, `@${context.userName} Deine Hinterlegten Pronomen sind '${user?.pronomen}'`);
        } else {
            await UserModel.updateOne(
                { username: context.userName },
                { $set: { pronomen: parts.slice(1).join(' ') } },
                { upsert: true }
            );

            sayService.say(origin, '', '', channel, `@${context.userName} Deine Hinterlegten Pronomen sind '${parts.slice(1).join(' ')}'`);
        }
    };
}

let pronomenCommand = new PronomenCommand();

export default pronomenCommand;
