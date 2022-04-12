import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import DiscordCommand from "./DiscordCommand";
dotenv.config({ path: __dirname+'/../.env' });

class DCCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'dc';
    description    = 'Discord';
    answerNoTarget = '###DISPLAYNAME###: https://discord.link/flauschecke';
    answerTarget   = '';
}


let dcCommand = new DCCommand();

export default dcCommand;