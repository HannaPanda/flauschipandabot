import AbstractCommand from "../Abstracts/AbstractCommand";

class KnochenmoppCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'knochenmopp';
    description    = 'Hanna beim Aufräumen helfen';
    answerNoTarget = '###ORIGIN### schnappt sich den Knochenmopp und hilft Hanna beim Aufräumen. Dank ###ORIGIN### kann Hanna nun Panda-Dinge machen.';
    answerTarget   = '';
    globalCooldown = 0;
}

let knochenmoppCommand = new KnochenmoppCommand();

export default knochenmoppCommand;
