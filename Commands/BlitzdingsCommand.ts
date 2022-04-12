import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class BlitzdingsCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'blitzdings';
    description    = 'Wenn man mal etwas vergessen muss';
    answerNoTarget = '###DISPLAYNAME### blitzdingst sich mal eben schnell selbst ins Mittelalter';
    answerTarget   = '###DISPLAYNAME### setzt sich lässig eine Sonnenbrille auf und blitzdingst ###TARGET###\'s Verstand in\'s Gestern';
}

let blitzdingsCommand = new BlitzdingsCommand();

export default blitzdingsCommand;