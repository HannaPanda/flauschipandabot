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

        if(!context.userName || context.owner || context.userName === 'flauschipandabot') {
            return Promise.resolve(false);
        }

        if(!streamService.currentStream) {
            return Promise.resolve(false);
        }

        let greetedUser = await mongoDBClient
            .db("flauschipandabot")
            .collection("greeted_users")
            .findOne({name: context.userName}, {});

        if(greetedUser) {
            return Promise.resolve(false);
        }

        await mongoDBClient
            .db("flauschipandabot")
            .collection("greeted_users")
            .insertOne({name: context.userName});

        switch (context.userName) {
            case 'killerpretzel':
                emitter.emit('chat.message', '!brezel', ['!brezel'], {username: '', 'display-name': '', mod: false, owner: false});
                break;
            case 'lormos':
                emitter.emit('playAudio', {file: 'feueball.mp3', mediaType: 'audio', volume: 0.5});
                sayService.say(origin, context.displayName, '', channel, `/me überschüttet ###ORIGIN### zur Begrüßung mit einem Haufen flauschiger Herzen emote_heart emote_heart emote_heart`);
                break;
            case 'yoshi_das_flohfell':
                emitter.emit('playAudio', {file: 'fluffy.mp3', mediaType: 'audio', volume: 0.5});
                sayService.say(origin, context.displayName, '', channel, `/me schaut doch mal bei http://TheSoftPlanet.etsy.com vorbei. So süße Flauschis emote_heart emote_heart emote_heart`);
                break;
            default:
                //sayService.say(origin, context.displayName, '', channel, `/me flauscht ###ORIGIN### zur Begrüßung richtig durch emote_greet`);
                emitter.emit('playAudio', {file: 'hello.mp3', mediaType: 'audio', volume: 0.5});
        }

        if(this.streamers.indexOf(context.userName) !== -1) {
            const text = `Schaut doch mal bei ###ORIGIN### vorbei: https://twitch.tv/${context.userName} emote_hype`;
            sayService.say(origin, context.displayName, '', channel, text);
        }

        let user = await mongoDBClient
            .db("flauschipandabot")
            .collection("users")
            .findOne({name: context.userName}, {});

        if(!user) {
            const response = await openAiClient.getChatGPTResponse(`
        Bitte begrüße den User ${context.displayName} ganz lieb zu Hanna's Stream. 
        Nutze genderneutrale Sprache. 
        Behandle die Person als sei sie komplett neu im Stream.`, '', false, '60');
            sayService.say(origin, context.displayName, '', channel, response);

            await mongoDBClient
                .db("flauschipandabot")
                .collection("users")
                .insertOne({name: context.userName});
        } else {
            const pronomenText = (user?.pronomen) ? `Die Pronomen der Person sind '${user?.pronomen}'` : 'Nutze genderneutrale Sprache.';

            const response = await openAiClient.getChatGPTResponse(`
        Bitte begrüße den User ${context.displayName} ganz lieb zu Hanna's Stream. 
        ${pronomenText} 
        Behandle die Person wie einen bereits Bekannten Menschen.`, '', false, '60');
            sayService.say(origin, context.displayName, '', channel, response);

        }
        return Promise.resolve(true);
    }
}

let greetEvent = new GreetEvent();

export default greetEvent;