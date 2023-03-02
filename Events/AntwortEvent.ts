import emitter from "../emitter";
import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import sayService from "../Services/SayService";
import streamService from "../Services/StreamService";
import openAiClient from "../Clients/openAiClient";
//import { OpenAI } from '@dalenguyen/openai'
//import { CompletionRequest, EngineName } from '@dalenguyen/openai'

dotenv.config({ path: __dirname+'/../.env' });

//const openAI = new OpenAI(process.env.OPENAI_API_KEY);
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class AntwortEvent
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

        if(/@flauschipandabot/i.test(message) || /@950121475619323924/i.test(message)) {

            message = message.replace('<@950121475619323924>', '@FlauschiPandaBot');

            let username = (origin === 'tmi') ? context['display-name'] : context.username;

            if(username && username.toLowerCase() === 'flauschipandabot') {
                return Promise.resolve(false);
            }
            
            //const gameName = streamService.currentStream?.game_name ? `Wir streamen "${streamService.currentStream?.game_name}"` : 'Wir spielen gerade nichts';

            const response = await openAiClient.getResponse(`Frage von "@${username}": ${message}`);
            sayService.say(origin, context['display-name'], '', channel, response);

            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
}

let antwortEvent = new AntwortEvent();

export default antwortEvent;