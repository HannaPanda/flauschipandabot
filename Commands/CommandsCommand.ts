import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class CommandsCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'commands';
    isAggressive   = false;
    description    = 'Zeige alle Commands';
    answerNoTarget = '###ORIGIN###: Du findest eine Liste aller Commands hier: https://www.hannapanda.de/commands';
    answerTarget   = '';
    globalCooldown = 0;
}

let commandsCommand = new CommandsCommand();

export default commandsCommand;