import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

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