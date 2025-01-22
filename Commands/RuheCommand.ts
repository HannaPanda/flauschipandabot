import AbstractCommand from "../Abstracts/AbstractCommand";

class RuheCommand extends AbstractCommand
{
    isActive       = false;
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

        //obsClient.send('SetCurrentScene', {'scene-name': 'Panik'});

        return Promise.resolve(true);
    }
}

let ruheCommand = new RuheCommand();

export default ruheCommand;
