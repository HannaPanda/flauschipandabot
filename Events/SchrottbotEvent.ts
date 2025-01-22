import emitter from "../emitter";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";

class SchrottbotEvent
{
    isActive = true;

    answers = [
        '###ORIGIN### ich bin doch kein Schrottbot hannap5D',
        '/me weint leise in der Ecke',
        '7ban ###ORIGIN### hannap5Angry'
    ];

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    private handleEvent = async (message, parts, context, origin = 'tmi', channel = null) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        if(/schrottbot/i.test(message) && !/flauschipandabot/i.test(message)) {
            if(context.userName && context.userName === 'flauschipandabot') {
                return Promise.resolve(false);
            }

            /*const targetName = parts.slice(1).join(' ');
            const displayName = (origin === 'tmi') ? `@${context.displayName}` : context.displayName;
            const text = this.answers[this.randomInt(0, this.answers.length - 1)];

            sayService.say(origin, displayName, targetName, channel, text);*/

            const response = await openAiClient.getChatGPTResponse(`Der User ${context.displayName} hat dich Schrottbot genannt. Sag ihm in eindringlicher Sprache, was du davon hälst.`, '', false);
            sayService.say(origin, context.displayName, '', channel, response);

            if(context.userName === 'jukrichel') {
                await openAiClient.botSay('Juki ist doof :(');
            }

            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    protected randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

let schrottbotEvent = new SchrottbotEvent();

export default schrottbotEvent;
