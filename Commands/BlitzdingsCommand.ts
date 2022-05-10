import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class BlitzdingsCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'blitzdings';
    description    = 'Wenn man mal etwas vergessen muss';
    answerNoTarget = '###ORIGIN### blitzdingst sich mal eben schnell selbst ins Mittelalter';
    answerTarget   = '###ORIGIN### setzt sich lässig eine Sonnenbrille auf und blitzdingst ###TARGET###\'s Verstand in\'s Gestern';
    globalCooldown = 0;
}

let blitzdingsCommand = new BlitzdingsCommand();

export default blitzdingsCommand;