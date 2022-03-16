import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
dotenv.config({ path: __dirname+'/../.env' });

class FlauschCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    command        = 'flausch';
    description    = 'Flausche jemanden durch';
    answerNoTarget = '###DISPLAYNAME### flauscht ins Leere v( ‘.’ )v';
    answerTarget   = '###DISPLAYNAME### flauscht ###TARGET### ( ◕‿◕)/(^•ω•^)';
}

let flauschCommand = new FlauschCommand();

export default flauschCommand;