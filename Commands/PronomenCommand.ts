import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class PronomenCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'pronomen';
    aliases        = ['!pronouns'];
    description    = 'Pronomen im Chat Hinweis';
    answerNoTarget = `Eure Pronomen im Chat? Geht einfach auf https://pronouns.alejo.io/ und meldet euch über Twitch dort an. 
        Dort könnt ihr eure Pronomen auswählen. 
        Dazu noch die Browserextension für Chrome: https://pronouns.alejo.io/chrome oder Firefox: https://pronouns.alejo.io/firefox emote_heart emote_heart emote_heart`;
    answerTarget   = '';
    globalCooldown = 0;
}

let pronomenCommand = new PronomenCommand();

export default pronomenCommand;