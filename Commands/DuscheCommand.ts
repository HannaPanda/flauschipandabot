import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import knochenCommand from "./KnochenCommand";
import Fighter from "../Models/Fighter";
import mongoDBClient from "../Clients/mongoDBClient";
import {MiscModel} from "../Models/Misc";
dotenv.config({ path: __dirname+'/../.env' });

class DuscheCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'dusche';
    description    = 'Kalte Dusche bei zu hitzigen Gedanken';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const document = await MiscModel.findOne({ identifier: 'hornyLevel' });

        let curHornyLevel = Math.max(0, ((document && document.value) ? document.value : 0) - 5);

        await MiscModel.updateOne(
            { identifier: 'hornyLevel' },
            { $set: { value: curHornyLevel } },
            { upsert: true }
        );
        emitter.emit('hornyLevelChanged', curHornyLevel);

        return Promise.resolve(true);
    }
}

let duscheCommand = new DuscheCommand();

export default duscheCommand;