import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import obsClient from "../Clients/obsClient";
dotenv.config({ path: __dirname+'/../.env' });

class RuheCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = true;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'ruhe';
    description    = 'Umschalten auf Ruhemodus';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        if(origin !== 'tmi') {
            return Promise.resolve(false);
        }

        obsClient.send('SetCurrentScene', {'scene-name': 'Panik'});

        return Promise.resolve(true);
    }
}

let ruheCommand = new RuheCommand();

export default ruheCommand;