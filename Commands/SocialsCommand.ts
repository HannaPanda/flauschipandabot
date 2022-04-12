import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class SocialsCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'socials';
    description    = 'Socials';
    answerNoTarget = '###DISPLAYNAME###: https://discord.link/flauschecke | https://twitter.com/HannaPanda84 | https://www.instagram.com/hannapanda84/ | https://vm.tiktok.com/ZMLFUQ9mr/';
    answerTarget   = '';
}

let socialsCommand = new SocialsCommand();

export default socialsCommand;