import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class LurkCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'lurk';
    description    = 'Bin dann mal weg';
    answerNoTarget = '###ORIGIN### verschwindet im Flausch 🥰';
    answerTarget   = '';
    globalCooldown = 0;
}

let lurkCommand = new LurkCommand();

export default lurkCommand;