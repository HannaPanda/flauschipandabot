import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class LurkCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    command        = 'lurk';
    description    = 'Bin dann mal weg';
    answerNoTarget = '###DISPLAYNAME### verschwindet im Flausch 🥰';
    answerTarget   = '';
}

let lurkCommand = new LurkCommand();

export default lurkCommand;