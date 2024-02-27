import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";
import storyService from "../Services/StoryService";
dotenv.config({ path: __dirname+'/../.env' });

class StoryTimer extends AbstractTimer
{
    isActive  = false;
    minutes   = 61;
    chatLines = 5;

    handler = async () => {
        /*const text1 = `Hier eine kleine lustige, verrückte Geschichte:`;
        sayService.say('tmi', '', '', null, text1);*/

        const story = await storyService.getRandomStory();

        sayService.say('tmi', '', '', null, story);
    }
}

let storyTimer = new StoryTimer();

export default storyTimer;