import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class DiscordTimer extends AbstractTimer
{
    isActive  = true;
    minutes   = 35;
    chatLines = 5;

    handler = () => {
        //const text1 = `Besucht die flauschigste Community auf Discord: https://discord.gg/mX4n5FFhPY emote_heart hannap5Need`;
        const text1 = `Besucht die flauschigste Community auf Discord https://discord.gg/mX4n5FFhPY emote_heart hannap5Need`;
        sayService.say('tmi', '', '', null, text1);

        /*const text2 = `Quatscht live zusammen mit mir im "On Stream" Voice Channel. Meldet euch mit eurem Discord Nick bei mir und ich lade euch ein emote_heart`;
        sayService.say('tmi', '', '', null, text2);*/
    }
}

let discordTimer = new DiscordTimer();

export default discordTimer;