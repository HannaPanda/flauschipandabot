import AbstractCommand from "../Abstracts/AbstractCommand";
import server from "../server";
import {MiscModel} from "../Models/Misc";

class UnfuckCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = true;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'unfuck';
    aliases        = [];
    description    = 'Verringert den Fuck Counter um 1';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 3;

    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const numberPattern = /\d+/g;
        const numbers = parts.slice(1).join(' ').match( numberPattern );
        const number = (numbers) ? numbers.join('') : '';

        const numberOfFucksToAdd = (number !== '' && parseInt(number) > 0) ? parseInt(number) : 1;

        server.getIO().emit('playAudio', {file: 'kcauq.mp3', mediaType: 'audio', volume: 0.2});

        const document = await MiscModel.findOne({ identifier: 'fuckCounter' });

        const fuckCounter = (document && document.value) ? document.value : 0;
        const newFuckCounter = Math.max(fuckCounter - numberOfFucksToAdd, 0);

        await MiscModel.updateOne(
            { identifier: 'fuckCounter' },
            { $set: { value: newFuckCounter } },
            { upsert: true }
        );

        server.getIO().emit('fuckCounterChanged', newFuckCounter);

        return Promise.resolve(true);
    }
}

let unfuckCommand = new UnfuckCommand();

export default unfuckCommand;
