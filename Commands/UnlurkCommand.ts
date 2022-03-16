import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class UnlurkCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    command        = 'unlurk';
    description    = 'Bin wieder da';
    answerNoTarget = '###DISPLAYNAME### ist wieder da! emote_hype';
    answerTarget   = '';
}

let unlurkCommand = new UnlurkCommand();

export default unlurkCommand;