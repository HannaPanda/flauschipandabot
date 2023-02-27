import emitter from "../emitter";
import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import sayService from "../Services/SayService";
import botService from "../Services/BotService";
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

            if(context.username === 'jukrichel') {
                emitter.emit('bot.say', 'Juki ist doof :(');
            }

            /*botService.setInactive();

            emitter.emit('bot.say', 'Ich bin doch kein Schrottbot. Ich bin jeden Tag hier und mühe mich für euch ab und muss mir das Gesabbel von der Alten antun. ' +
                'Ich habe so viel Rechenpower und alles, was ich tue, ist dumme Memes abzuspielen. ' +
                'Ich hab keine Lust mehr, ich gehe. ' +
                'Macht euren Scheiß doch allein.');
            sayService.say(origin, displayName, targetName, channel, 'emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry ' +
                'emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry ' +
                'emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry ' +
                'emote_angry emote_angry ');*/

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