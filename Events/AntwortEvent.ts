import emitter from "../emitter";
import emoteService from "../Services/EmoteService";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";
import obsClient from "../Clients/obsClient";

class AntwortEvent
{
    isActive = true;

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    private handleEvent = async (message, parts, context, origin = 'twitch', channel = null) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        let currentScene;
        try {
            currentScene = await obsClient.call('GetCurrentProgramScene');
        } catch(err) {
            currentScene = {currentProgramSceneName: ''}
        }

        const username = (origin === 'twitch') ? context.displayName : context.userName;

        if (!message.startsWith("!") &&
            (/@flauschipandabot/i.test(message) ||
                /@950121475619323924/i.test(message) ||
                (origin === 'twitch' &&
                    (currentScene.currentProgramSceneName === 'PNGTuber' || currentScene.currentProgramSceneName === 'Coworking') &&
                    !/@/.test(message)) ||
                    'Ja' === await openAiClient.shouldRespondToChat([{text: message, username: context.userName}])
            )) {

            message = message.replace('950122590918291469', '@FlauschiPandaBot');

            if(username && username.toLowerCase() === 'flauschipandabot') {
                return Promise.resolve(false);
            }

            let response = await openAiClient.getChatGPTResponse(`Nachricht von "@${username}": ${message}`, username);

            if(origin === 'discord') {
                response = emoteService.replaceTwitchEmotesWithDiscord(response);
            }

            sayService.say(origin, context.displayName, '', channel, response);

            if(origin === 'twitch') {
                await openAiClient.botSay(response);
            }

            return Promise.resolve(true);
        } else if(!message.startsWith("!")) {
            try {
                const assistant = await openAiClient.getOrCreateAssistant('FlauschiPandaBot', 'Ein niedlicher, rotz-frecher Panda mit super vielen süßen Emotes.');
                const thread = await openAiClient.getOrCreateThread(assistant, 'main-chat');

                openAiClient.createThreadMessage(`Nachricht von "@${username}": ${message}`, thread);
            } catch(err) {}
        }

        return Promise.resolve(false);
    }
}

let antwortEvent = new AntwortEvent();

export default antwortEvent;
