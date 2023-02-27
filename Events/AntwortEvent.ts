import emitter from "../emitter";
import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import sayService from "../Services/SayService";
import streamService from "../Services/StreamService";
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

        console.log(message);

        if(/@flauschipandabot/i.test(message) || /@950121475619323924/i.test(message)) {

            message = message.replace('<@950121475619323924>', '@FlauschiPandaBot');

            let username = (origin === 'tmi') ? context['display-name'] : context.username;

            if(username && username.toLowerCase() === 'flauschipandabot') {
                return Promise.resolve(false);
            }

            // OpenAI Antwort
            /*const completionRequest: CompletionRequest = {
                prompt: `
Du bist ein Twitch-Bot. Dein Name ist FlauschiPandaBot. Die Streamerin heißt HannaPanda84.
Du sollst Anfragen der Chat-Teilnehmer auf lustige und lockere Art beantworten. Du darfst niemals mit Code, Sonderzeichen, oder URLs antworten. Deine Antworten sollen maximal 200 Zeichen haben.
Hier ist die Anfrage von ${username}: ${message}`,
                temperature: 0,
                max_tokens: 100,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                //stop: [''],
            };

            openAI
                .createCompletion(EngineName.Ada, completionRequest)
                .then((res) => console.log(res))
                .catch((error) => console.error(error));*/

            const gameName = streamService.currentStream?.game_name ? `Wir streamen "${streamService.currentStream?.game_name}"` : 'Wir spielen gerade nichts';
            //const gameName = 'Wir streamen 20 Minutes till dawn';

            //Antworte wie eine grantige, wütende alte Frau.
            //Antworte im Stil eines britischen Gentleman aus dem 19. Jahrhundert.

            /*const prompt = `
             Antworte als FlauschiPandaBot auf Anfragen im Chat von HannaPanda84. Antworte im Neko-Stil.
             ${gameName}
             Frage von "@${username}": ${message}
             You:`;*/

            /*const prompt = `
Antworte als FlauschiPandaBot auf Anfragen im Chat von HannaPanda84. Antworte super süß als Panda Nekomimi.
Frage von "@${username}": ${message} 
You:`;*/

            /*const prompt = `
Antworte als FlauschiPandaBot auf Anfragen im Chat von HannaPanda84. Antworte süß im Stil eines Nekos mit vielen süßen Emotes.
Frage von "@${username}": ${message} 
You:`;*/
            const prompt = `
Erstelle einen niedlichen und adorablen Chatbot-Archetyp, indem du einen Panda als Inspiration verwendest. Verwende dabei auch Kawaii-Emoticons, um den Archetyp zu verstärken. Dein Name ist FlauschiPandaBot und deine Mama ist HannaPanda84 (Hanna).
Nutze ausschließlich folgende Emotes:  
hannap5Hype hannap5Need hannap5Lurk hannap5D hannap5Note hannap5Hehe hannap5Angry hannap5OhNo hannap5Sleep hannap5Rave hannap5PandaWoah hannap5Flower hannap5Wave hannap5Heart
Frage von "@${username}": ${message} 
You:`;

            console.log(prompt);

            try {
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: prompt,
                    temperature: 0.7,
                    max_tokens: 150,
                    top_p: 1.0,
                    frequency_penalty: 0.5,
                    presence_penalty: 0.0,
                    stop: ["You:"],
                });

                console.log(response.data.choices[0].text);
                sayService.say(origin, context['display-name'], '', channel, response.data.choices[0].text.replace(/\n|\r/g, "").replace(/^[!/]/, ""));
            } catch(err) {
                console.log(err);
                sayService.say(origin, context['display-name'], '', channel, `[Fehler bei Server-Antwort]`);
            }

            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
}

let antwortEvent = new AntwortEvent();

export default antwortEvent;