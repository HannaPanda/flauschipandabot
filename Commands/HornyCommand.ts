import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import knochenCommand from "./KnochenCommand";
import Fighter from "../Models/Fighter";
dotenv.config({ path: __dirname+'/../.env' });

class HornyCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'horny';
    description    = 'Horny Bonk';
    answerNoTarget = '';
    answerTarget   = '';

    curHornyLevel  = 0;

    constructor() {
        super();

        setInterval(() => {
            this.curHornyLevel = Math.max(0, this.curHornyLevel - 1);
            emitter.emit('hornyLevelChanged', this.curHornyLevel);
        }, 300000);
    }

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        this.curHornyLevel = Math.min(100, this.curHornyLevel + 10);

        emitter.emit('hornyLevelChanged', this.curHornyLevel);

        return Promise.resolve(true);
    }
}

let hornyCommand = new HornyCommand();

export default hornyCommand;