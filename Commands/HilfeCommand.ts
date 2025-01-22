import AbstractCommand from "../Abstracts/AbstractCommand";

class HilfeCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'hilfe';
    aliases        = ['!help', '!zurhülfli'];
    description    = 'Hilfe bei Problemen';
    answerNoTarget = 'Jeder braucht mal HILFE: https://www.telefonseelsorge.de/ | 0800/111 0 111 · 0800/111 0 222 · 116 123 - kostenfrei | https://www.maennerhilfetelefon.de/ - 0800 1239900 - beratung@maennerhilfetelefon.de | Hilfetelefon "Gewalt gegen Frauen" - https://www.hilfetelefon.de/ - 08000 116 016 | OHNE TELEFON: Krisenchat für junge Menschen unter 25 (Chatberatung, 24/7 erreichbar): https://krisenchat.de/ Online-Beratung für Personen jeden Alters: https://www.caritas.de/onlineberatung';
    answerTarget   = '';
    globalCooldown = 0;
}

let hilfeCommand = new HilfeCommand();

export default hilfeCommand;
