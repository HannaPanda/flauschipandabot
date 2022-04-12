import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class KnochenmoppCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'knochenmopp';
    description    = 'Hanna beim Aufräumen helfen';
    answerNoTarget = '###DISPLAYNAME### schnappt sich den Knochenmopp und hilft Hanna beim Aufräumen. Dank ###DISPLAYNAME### kann Hanna nun Panda-Dinge machen.';
    answerTarget   = '';
}

let knochenmoppCommand = new KnochenmoppCommand();

export default knochenmoppCommand;