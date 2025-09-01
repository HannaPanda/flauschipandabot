import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import sayService from "../Services/SayService";

class TestCommand extends AbstractCommand
{
    isActive       = true;
    isVipOnly      = false;
    isModOnly      = true;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'test';
    description    = 'etwas testen';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;
    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const oldUsers = await mongoDBClient
            .db('flauschipandabot').collection('users').find().toArray();

        sayService.say(origin, context.displayName, '', channel, 'test für twitch');
        for (const oldUser of oldUsers) {
            /*const updatedUser = {
                username: oldUser.name,
                role: oldUser.role || 'viewer',
                pronomen: oldUser.pronomen || '',
                usernameOffenseScore: oldUser.usernameOffenseScore !== undefined ? oldUser.usernameOffenseScore : null
            };

            console.log(updatedUser);

            await UserModel.updateOne(
                { username: oldUser.name },
                { $set: updatedUser },
                { upsert: true }
            );*/

            /*const result = await UserModel.deleteMany({ username: { $exists: false } });
            console.log(`Deleted ${result.deletedCount} users without username field`);*/
        }
    };
}

let testCommand = new TestCommand();

export default testCommand;
