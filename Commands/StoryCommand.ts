import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import storyService from "../Services/StoryService";

class BrezelCommand extends AbstractCommand
{
    isActive       = true;
    isVipOnly      = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'story';
    description    = 'Erzähle eine Geschichte';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;
    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const story = await storyService.getUserStory(context.userName);
        sayService.say(origin, '', '', channel, story);
    };
}

let brezelCommand = new BrezelCommand();

export default brezelCommand;
