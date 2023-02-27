import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class DiscordTimer extends AbstractTimer
{
    isActive  = true;
    minutes   = 65;
    chatLines = 5;

    handler = () => {
        const text = `Eure Pronomen im Chat? Geht einfach auf https://pronouns.alejo.io/ und meldet euch über Twitch dort an. 
        Dort könnt ihr eure Pronomen auswählen. 
        Dazu noch die Browserextension für Chrome: https://pronouns.alejo.io/chrome oder Firefox: https://pronouns.alejo.io/firefox emote_heart emote_heart emote_heart`;

        sayService.say('tmi', '', '', null, text);
    }
}

let discordTimer = new DiscordTimer();

export default discordTimer;