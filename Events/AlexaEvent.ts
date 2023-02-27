import emitter from "../emitter";
import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import sayService from "../Services/SayService";
import botService from "../Services/BotService";
dotenv.config({ path: __dirname+'/../.env' });

class AlexaEvent
{
    isActive = true;

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    private handleEvent = async (message, parts, context, origin = 'tmi', channel = null) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        if(/alexa/i.test(message) || /aiexa/i.test(message)) {
            if(context.username && context.username.toLowerCase() === 'flauschipandabot') {
                return Promise.resolve(false);
            }

            emitter.emit('bot.say', 'Alexa stop!');

            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    protected randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

let alexaEvent = new AlexaEvent();

export default alexaEvent;