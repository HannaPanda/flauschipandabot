import emitter from "../emitter";
import AbstractCommand from "../Abstracts/AbstractCommand";
import server from "../server";
import {MiscModel} from "../Models/Misc";

class HornyCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'horny';
    aliases        = ['!bonk'];
    description    = 'Horny Bonk';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    constructor() {
        super();

        setInterval(async () => {
            const document = await MiscModel.findOne({ identifier: 'hornyLevel' });

            let curHornyLevel = Math.max(0, ((document && document.value) ? document.value : 0) - 1);

            await MiscModel.updateOne(
                { identifier: 'hornyLevel' },
                { $set: { value: curHornyLevel } },
                { upsert: true }
            );

            emitter.emit('hornyLevelChanged', curHornyLevel);
        }, 300000);
    }

    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const document = await MiscModel.findOne({ identifier: 'hornyLevel' });

        server.getIO().emit('showImage', { file: 'horny.png', mediaType: 'image', duration: 5000 });
        server.getIO().emit('playAudio', { file: 'bonk.mp3', mediaType: 'audio', volume: 0.2 });

        const curHornyLevel = (document && document.value) ? document.value : 0;
        if (curHornyLevel >= 100) {
            return Promise.resolve(true);
        }

        let newHornyLevel = Math.min(100, (curHornyLevel + 10));

        await MiscModel.updateOne(
            { identifier: 'hornyLevel' },
            { $set: { value: newHornyLevel } },
            { upsert: true }
        );

        emitter.emit('hornyLevelChanged', newHornyLevel);

        return Promise.resolve(true);
    }
}

let hornyCommand = new HornyCommand();

export default hornyCommand;
