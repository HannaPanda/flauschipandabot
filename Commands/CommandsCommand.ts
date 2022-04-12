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
    description    = 'Zeige alle Commands';
    answerNoTarget = '###DISPLAYNAME###: Du findest eine Liste aller Commands hier: http://www.hannapanda.de/commands';
    answerTarget   = '';
}

let commandsCommand = new CommandsCommand();

export default commandsCommand;