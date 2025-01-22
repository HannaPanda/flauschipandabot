import emitter from "../emitter";
import emoteService from "./EmoteService";

class SayService
{
    public say = (origin, displayName, targetName, channel, message) => {
        message = message
            .split('###ORIGIN###').join(displayName)
            .split('###TARGET###').join(targetName)
            .replace(/emote_([a-zA-Z0-9]+)/g, (match, contents, offset, input_string) => {
                return emoteService.getEmote(origin, match);
            })
            .replace(/\[?\(?(#\b[A-Z]+\b#)\)?\]?/g, '');

        const emoteStarRegex = /\*\s*(hannap5[a-zA-Z0-9]+)\s*\*/g;
        message = message.replace(emoteStarRegex, "$1");

        const emoteRegex = new RegExp(`(${emoteService.botTwitchEmotes.join('|')})`, 'gi');
        message = message.replace(emoteRegex, (match) => emoteService.botTwitchEmotes.find(emote => emote.toLowerCase() === match.toLowerCase()));

        if(origin === 'tmi') {
            message = message.replace(emoteRegex, ' $1 ');
        } else {
            message = message.replace(emoteRegex, '$1');
        }

        emitter.emit(`${origin}.say`, message, channel);
    }
}

const sayService = new SayService();

export default sayService;
