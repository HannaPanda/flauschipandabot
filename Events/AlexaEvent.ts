import emitter from "../emitter";
import openAiClient from "../Clients/openAiClient";

class AlexaEvent
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

        if(/alexa/i.test(message) || /aiexa/i.test(message)) {
            if(context.userName && context.userName === 'flauschipandabot') {
                return Promise.resolve(false);
            }

            await openAiClient.botSay('Alexa stop!');

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
