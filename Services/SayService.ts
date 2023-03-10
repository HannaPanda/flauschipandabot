import * as dotenv from "dotenv";
import discordClient from "../Clients/discordClient";
import emitter from "../emitter";
import emoteService from "./EmoteService";
dotenv.config({ path: __dirname+'/../.env' });

class SayService
{
    say = (origin, displayName, targetName, channel, message) => {
        message = message
            .split('###ORIGIN###').join(displayName)
            .split('###TARGET###').join(targetName)
            .replace(/emote_([a-zA-Z0-9]+)/g, (match, contents, offset, input_string) => {
                return emoteService.getEmote(origin, match);
            });

        /*const emotesRegex = new RegExp(emoteService.botTwitchEmotes.map(emote => `\\b${emote.toLowerCase()}\\b`).join("|"), "g");

        message = message.replace(emotesRegex, emote => ` ${emote} `);*/

        const emoteRegex = new RegExp(`(${emoteService.botTwitchEmotes.join('|')})`, 'gi');
        message = message.replace(emoteRegex, (match) => emoteService.botTwitchEmotes.find(emote => emote.toLowerCase() === match.toLowerCase()));
        message = message.replace(emoteRegex, ' $1 ');


        emitter.emit(`${origin}.say`, message, channel);
    }
}

const sayService = new SayService();

export default sayService;