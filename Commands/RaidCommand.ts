import AbstractCommand from "../Abstracts/AbstractCommand";

class RaidCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'raid';
    aliases        = [];
    description    = 'Panda Raid :D';
    answerNoTarget = 'Panda hannap5Hehe Raid hannap5Hehe Panda hannap5Hehe Raid hannap5Hehe Panda hannap5Hehe Raid hannap5Hehe Panda hannap5Hehe Raid hannap5Hehe Panda hannap5Hehe Raid hannap5Hehe Panda hannap5Hehe Raid hannap5Hehe';
    answerTarget   = '';
    globalCooldown = 0;
}

let raidCommand = new RaidCommand();

export default raidCommand;
