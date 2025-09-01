import AbstractCommand from "../Abstracts/AbstractCommand";
import server from "../server";
import {MiscModel} from "../Models/Misc";

class VerpissdichCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = true;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'verpissdich';
    aliases        = [];
    description    = 'Erhöht den Verpiss Dich Counter um 1';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 3;

    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const numberPattern = /\d+/g;
        const numbers = parts.slice(1).join(' ').match( numberPattern );
        const number = (numbers) ? numbers.join('') : '';

        const numberOfVerpissdichToAdd = (number !== '' && parseInt(number) > 0) ? parseInt(number) : 1;

        const document = await MiscModel.findOne({ identifier: 'verpissdichCounter' });

        const verpissdichCounter = (document && document.value) ? document.value : 0;
        const newVerpissdichCounter = verpissdichCounter + numberOfVerpissdichToAdd;

        await MiscModel.updateOne(
            { identifier: 'verpissdichCounter' },
            { $set: { value: newVerpissdichCounter } },
            { upsert: true }
        );

        server.getIO().emit('verpissdichCounterChanged', newVerpissdichCounter);

        return Promise.resolve(true);
    }
}

let verpissdichCommand = new VerpissdichCommand();

export default verpissdichCommand;
