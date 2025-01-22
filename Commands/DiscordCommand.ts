import AbstractCommand from "../Abstracts/AbstractCommand";

class DiscordCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'discord';
    aliases        = ['!dc'];
    description    = 'Discord';
    //answerNoTarget = '###ORIGIN###: Das flauschigste Discord der Welt https://discord.gg/mX4n5FFhPY';
    answerNoTarget = '###ORIGIN###: https://discord.gg/mX4n5FFhPY Quatscht live zusammen mit mir im "On Stream" Voice Channel. Meldet euch mit eurem Discord Nick bei mir und ich lade euch ein emote_heart';
    answerTarget   = '';
    globalCooldown = 0;
}

let discordCommand = new DiscordCommand();

export default discordCommand;
