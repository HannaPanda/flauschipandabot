import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class RaveCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'rave';
    description    = 'Party!!!!!!';
    answerNoTarget = 'emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave '+
        'emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave ';
    answerTarget   = null;
    globalCooldown = 0;
}

let raveCommand = new RaveCommand();

export default raveCommand;