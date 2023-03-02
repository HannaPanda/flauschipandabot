import emitter from "../emitter";
import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import streamService from "../Services/StreamService";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";
dotenv.config({ path: __dirname+'/../.env' });

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class GreetEvent
{
    isActive = true;

    private streamers: Array<string> = ['misakidestiny', 'murmelmaus_gina', 'teelinchen', 'eulinchen82', 'artimus83', 'serapinlp'];

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    private handleEvent = async (message, parts, context, origin = 'tmi', channel = null) => {
        if(!this.isActive || origin === 'discord') {
            return Promise.resolve(false);
        }

        if(!context.username || context.owner || context.username === 'flauschipandabot') {
            return Promise.resolve(false);
        }

        if(!streamService.currentStream) {
            return Promise.resolve(false);
        }

        let user = await mongoDBClient
            .db("flauschipandabot")
            .collection("greeted_users")
            .findOne({name: context.username}, {});

        if(user) {
            return Promise.resolve(false);
        }

        await mongoDBClient
            .db("flauschipandabot")
            .collection("greeted_users")
            .insertOne({name: context.username});

        switch (context.username) {
            case 'killerpretzel':
                emitter.emit('chat.message', '!brezel', ['!brezel'], {username: '', 'display-name': '', mod: false, owner: false});
                break;
            case 'lormos':
                emitter.emit('playAudio', {file: 'feueball.mp3', mediaType: 'audio', volume: 0.5});
                sayService.say(origin, context['display-name'], '', channel, `/me überschüttet ###ORIGIN### zur Begrüßung mit einem Haufen flauschiger Herzen emote_heart emote_heart emote_heart`);
                break;
            default:
                //sayService.say(origin, context['display-name'], '', channel, `/me flauscht ###ORIGIN### zur Begrüßung richtig durch emote_greet`);
                emitter.emit('playAudio', {file: 'hello.mp3', mediaType: 'audio', volume: 0.5});
        }

        if(this.streamers.indexOf(context.username) !== -1) {
            const text = `Schaut doch mal bei ###ORIGIN### vorbei: https://twitch.tv/${context.username.toLowerCase()} emote_hype`;
            sayService.say(origin, context['display-name'], '', channel, text);
        }

        const response = await openAiClient.getResponse(`Bitte begrüße den User ${context['display-name']} ganz lieb zu meinem Stream.`);
        sayService.say(origin, context['display-name'], '', channel, response);

        return Promise.resolve(true);
    }
}

let greetEvent = new GreetEvent();

export default greetEvent;