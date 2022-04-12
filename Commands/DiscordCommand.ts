import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class DiscordCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'discord';
    description    = 'Discord';
    answerNoTarget = '###DISPLAYNAME###: https://discord.link/flauschecke';
    answerTarget   = '';
}

let discordCommand = new DiscordCommand();

export default discordCommand;