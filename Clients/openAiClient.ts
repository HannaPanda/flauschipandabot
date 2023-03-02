//import { OpenAI } from '@dalenguyen/openai'
//import { CompletionRequest, EngineName } from '@dalenguyen/openai'
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname+'/../.env' });

//const openAI = new OpenAI(process.env.OPENAI_API_KEY);
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

class OpenAiClient
{
    private openAi;
    private standardPrompt = `
        Erstelle einen niedlichen und adorablen Chatbot-Archetyp, indem du einen Panda als Inspiration verwendest. Verwende dabei auch Kawaii-Emoticons, um den Archetyp zu verstärken. Dein Name ist FlauschiPandaBot und deine Mama ist HannaPanda84 (Hanna).
        Nutze ausschließlich folgende Emotes:  
        hannap5Hype hannap5Need hannap5Lurk hannap5D hannap5Note hannap5Hehe hannap5Angry hannap5OhNo hannap5Sleep hannap5Rave hannap5PandaWoah hannap5Flower hannap5Wave hannap5Heart
        Spaces vor und nach jedem Emote, keine Doppelpunkte.
        ###INPUT###
        You:`;
    private customPrompt = `
        ###INPUT###
        You:`

    constructor()
    {
        this.openAi = new OpenAIApi(configuration);
    }

    public getResponse = async (input) => {

        try {
            const response = await this.openAi.createCompletion({
                model: "text-davinci-003",
                prompt: this.standardPrompt.replace('###INPUT###', input),
                temperature: 0.7,
                max_tokens: 150,
                top_p: 1.0,
                frequency_penalty: 0.5,
                presence_penalty: 0.0,
                stop: ["You:"],
            });

            //console.log(response.data.choices[0].text);

            return Promise.resolve(response.data.choices[0].text.replace(/\n|\r/g, "").replace(/^[!/]/, ""));
        } catch(err) {
            return Promise.resolve('[Fehler bei Server-Antwort]');
        }

    };

    public getCustomPromptResponse = async (input) => {

        try {
            const response = await this.openAi.createCompletion({
                model: "text-davinci-003",
                prompt: this.customPrompt.replace('###INPUT###', input),
                temperature: 0.7,
                max_tokens: 150,
                top_p: 1.0,
                frequency_penalty: 0.5,
                presence_penalty: 0.0,
                stop: ["You:"],
            });

            //console.log(response.data.choices[0].text);

            return Promise.resolve(response.data.choices[0].text.replace(/\n|\r/g, "").replace(/^[!/]/, ""));
        } catch(err) {
            return Promise.resolve('[Fehler bei Server-Antwort]');
        }

    }
}

const openAiClient = new OpenAiClient();

export default openAiClient;