import AbstractCommand from "../Abstracts/AbstractCommand";

class MoppCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'mopp';
    description    = 'Schleimspur? Kein Problem!';
    answerNoTarget = 'Achtung Schleimspur! Ich wisch hier kurz mal weg!! ヾ(ﾟдﾟ)ﾉ';
    answerTarget   = 'Achtung, ich wisch hier nur mal ###TARGET###\'s Schleimspur weg!! ヾ(ﾟдﾟ)ﾉ';
    globalCooldown = 0;
}

let moppCommand = new MoppCommand();

export default moppCommand;
