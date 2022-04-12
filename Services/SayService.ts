import * as dotenv from "dotenv";
import discordClient from "../Clients/discordClient";
import emitter from "../emitter";
import emoteService from "./EmoteService";
dotenv.config({ path: __dirname+'/../.env' });

class SayService
{
    say = (origin, displayName, targetName, channel, message) => {
        emitter.emit(
            `${origin}.say`,
            message
                .split('###ORIGIN###').join(displayName)
                .split('###TARGET###').join(targetName)
                .replace(/emote_([a-zA-Z0-9]+)/g, (match, contents, offset, input_string) => {
                    return emoteService.getEmote(origin, match);
                }),
            channel
        );
    }
}

const sayService = new SayService();

export default sayService;