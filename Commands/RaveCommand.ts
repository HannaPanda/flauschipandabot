import AbstractCommand from "../Abstracts/AbstractCommand";

class RaveCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'rave';
    description    = 'Party!!!!!!';
    answerNoTarget = 'emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave '+
        'emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave emote_rave ';
    answerTarget   = null;
    globalCooldown = 0;
}

let raveCommand = new RaveCommand();

export default raveCommand;
