import emitter from "../emitter";
import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

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

        if(/schrottbot/i.test(message)) {
            if(context.username && context.username.toLowerCase() === 'flauschipandabot') {
                return Promise.resolve(false);
            }

            const targetName = parts.slice(1).join(' ');
            const displayName = (origin === 'tmi') ? `@${context['display-name']}` : context['display-name'];
            const text = this.answers[this.randomInt(0, this.answers.length - 1)];

            sayService.say(origin, displayName, targetName, channel, text);

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