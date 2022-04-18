import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class FlauschCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'flausch';
    description    = 'Flausche jemanden durch';
    answerNoTarget = '###DISPLAYNAME### flauscht ins Leere v( ‘.’ )v';
    //answerTarget   = '###DISPLAYNAME### flauscht ###TARGET### ( ◕‿◕)/(^•ω•^)';
    answerTarget   = 'emote_heart emote_heart ###DISPLAYNAME### flauscht ###TARGET### emote_heart emote_heart';
}

let flauschCommand = new FlauschCommand();

export default flauschCommand;