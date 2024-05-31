import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import storyService from "../Services/StoryService";
import openAiClient from "../Clients/openAiClient";
import emoteService from "../Services/EmoteService";
import mongoDBClient from "../Clients/mongoDBClient";
import {UserModel} from "../Models/User";
dotenv.config({ path: __dirname+'/../.env' });

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
    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const oldUsers = await mongoDBClient
            .db('flauschipandabot').collection('users').find().toArray();

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