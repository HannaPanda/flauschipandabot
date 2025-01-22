import AbstractCommand from "../Abstracts/AbstractCommand";

class SocialsCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'socials';
    description    = 'Socials';
    answerNoTarget = '###ORIGIN###: https://discord.gg/mX4n5FFhPY | https://twitter.com/HannaPanda84 | https://www.instagram.com/hannapanda84/ | https://vm.tiktok.com/ZMLFUQ9mr/';
    answerTarget   = '';
    globalCooldown = 0;
}

let socialsCommand = new SocialsCommand();

export default socialsCommand;
