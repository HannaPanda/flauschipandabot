import emitter from "../emitter";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import Fighter from "../Models/Fighter";
import moment from "moment";
import sayService from "../Services/SayService";
import mongoDBClient from "../Clients/mongoDBClient";
import botService from "../Services/BotService";
import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import storyService from "../Services/StoryService";
import server from "../server";
dotenv.config({ path: __dirname+'/../.env' });

class StoryRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Eine Story über mich vom Bot erzählen lassen";
    handler  = async (message) => {
        const story = await storyService.getUserStory(message.userName);
        sayService.say('tmi', '', '', null, story);
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const storyRedeemCommand = new StoryRedeemCommand();

export default storyRedeemCommand;