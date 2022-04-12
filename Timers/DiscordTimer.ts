import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class DiscordTimer extends AbstractTimer
{
    isActive  = true;
    minutes   = 30;
    chatLines = 5;

    handler = () => {
        const text = `Besucht die flauschigste Community auf Discord: https://discord.link/flauschecke ❤ hannap5Need`;
        sayService.say('tmi', '', '', null, text);
    }
}

let discordTimer = new DiscordTimer();

export default discordTimer;