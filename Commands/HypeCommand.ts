import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class HypeCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'hype';
    description    = 'HYPE HYPE HYPE';
    answerNoTarget = 'emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype ';
    answerTarget   = '';
}

let hypeCommand = new HypeCommand();

export default hypeCommand;