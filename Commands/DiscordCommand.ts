import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class DiscordCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'discord';
    aliases        = ['!dc'];
    description    = 'Discord';
    answerNoTarget = '###ORIGIN###: https://discord.link/flauschecke Quatscht live zusammen mit mir im "On Stream" Voice Channel. Meldet euch mit eurem Discord Nick bei mir und ich lade euch ein emote_heart';
    answerTarget   = '';
    globalCooldown = 0;
}

let discordCommand = new DiscordCommand();

export default discordCommand;