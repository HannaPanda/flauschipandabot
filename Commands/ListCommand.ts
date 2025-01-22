import AbstractCommand from "../Abstracts/AbstractCommand";

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
