import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class ListCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'list';
    aliases        = [];
    description    = 'Skyrim Spawn Liste';
    answerNoTarget = '!spawn und dann einen Code von hier: https://skyrimcommands.com/items';
    answerTarget   = '';
    globalCooldown = 0;
}

let listCommand = new ListCommand();

export default listCommand;