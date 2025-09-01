import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";
import storyService from "../Services/StoryService";

class StoryTimer extends AbstractTimer
{
    isActive  = false;
    minutes   = 61;
    chatLines = 5;

    handler = async () => {
        /*const text1 = `Hier eine kleine lustige, verrückte Geschichte:`;
        sayService.say('twitch', '', '', null, text1);*/

        const story = await storyService.getRandomStory();

        sayService.say('twitch', '', '', null, story);
    }
}

let storyTimer = new StoryTimer();

export default storyTimer;
