import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class FlauschCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'flausch';
    description    = 'Flausche jemanden durch';
    answerNoTarget = '###ORIGIN### flauscht ins Leere v( ‘.’ )v';
    answerTarget   = 'emote_heart emote_heart ###ORIGIN### flauscht ###TARGET### emote_heart emote_heart';
    globalCooldown = 0;
}

let flauschCommand = new FlauschCommand();

export default flauschCommand;