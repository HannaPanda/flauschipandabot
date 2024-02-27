import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import storyService from "../Services/StoryService";
import openAiClient from "../Clients/openAiClient";
import emoteService from "../Services/EmoteService";
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
        /*const response = await openAiClient.shouldRespondToChat([
            {username: context.username, text: message}
        ]);

        sayService.say(origin, '', '', channel, response);*/

        sayService.say(origin, '', '', channel, 'testing');
        const response = await openAiClient.getUsernameOffenseScore('Slaanesh_Prince_of_Lewd');
        sayService.say(origin, '', '', channel, `${response}`);
    };
}

let testCommand = new TestCommand();

export default testCommand;