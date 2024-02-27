import emitter from "../emitter";
import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import sayService from "../Services/SayService";
import streamService from "../Services/StreamService";
import openAiClient from "../Clients/openAiClient";
import server from "../server";
import obsClient from "../Clients/obsClient";

dotenv.config({ path: __dirname+'/../.env' });

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

        let currentScene;
        try {
            currentScene = await obsClient.call('GetCurrentProgramScene');
        } catch(err) {
            currentScene = {currentProgramSceneName: ''}
        }

        if (!message.startsWith("!") &&
            (/@flauschipandabot/i.test(message) ||
                /@950121475619323924/i.test(message) ||
                (origin === 'tmi' &&
                    (currentScene.currentProgramSceneName === 'PNGTuber' || currentScene.currentProgramSceneName === 'Coworking') &&
                    !/@/.test(message)))) {

            message = message.replace('950122590918291469', '@FlauschiPandaBot');

            let username = (origin === 'tmi') ? context.displayName : context.userName;

            if(username && username.toLowerCase() === 'flauschipandabot') {
                return Promise.resolve(false);
            }

            let response = await openAiClient.getChatGPTResponse(`Frage von "@${username}": ${message}`, username);

            if(origin === 'discord') {
                response = emoteService.replaceTwitchEmotesWithDiscord(response);
            }

            sayService.say(origin, context.displayName, '', channel, response);

            if(origin === 'tmi') {
                let result = await openAiClient.convertTextToSpeech(response);
                if(result) {
                    server.getIO().emit('bot.playAudio', result);
                }
            }

            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
}

let antwortEvent = new AntwortEvent();

export default antwortEvent;