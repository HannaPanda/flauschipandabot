import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import {Abenteurer} from "../Models/Abenteurer";
import {AbenteurerFactory} from "../Factory/AbenteurerFactory";
import {LevelSystem} from "../Utils/LevelSystem";

dotenv.config({ path: __dirname+'/../.env' });

class AvatarCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'avatar';
    description    = 'Erstelle oder bearbeite deinen Avatar';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        let avatar = await AbenteurerFactory.findAbenteurerByName(context.displayName);

        if(!avatar) {
            if(parts.length > 1) {
                switch(parts[1].toLowerCase()) {
                    case 'bambusmagier':
                        avatar = await AbenteurerFactory.createAbenteurer(context.displayName, 'Bambusmagier', 'Pandakin');
                        break;
                    case 'flauschheiler':
                        avatar = await AbenteurerFactory.createAbenteurer(context.displayName, 'Flauschheiler', 'Glitzerfellchen');
                        break;
                    case 'kuschelkrieger':
                        avatar = await AbenteurerFactory.createAbenteurer(context.displayName, 'Kuschelkrieger', 'Moospfötchen');
                        break;
                    case 'bogenschütze':
                        avatar = await AbenteurerFactory.createAbenteurer(context.displayName, 'Pfadsucher Bogenschütze', 'Flauschling');
                        break;
                    case 'schattenläufer':
                        avatar = await AbenteurerFactory.createAbenteurer(context.displayName, 'Schattenläufer', 'Bambusgeist');
                        break;
                    default:
                        let message = `Du hast noch keinen Avatar erstellt. Du kannst einen erstellen mit !avatar gefolgt von deiner Klasse.`;
                        message += ` Mögliche klassen sind Bambusmagier, Flauschheiler, Kuschelkrieger, Bogenschütze oder Schattenläufer.`;
                        sayService.say(origin, context.displayName, '', channel, message);
                }
            } else {
                let message = `Du hast noch keinen Avatar erstellt. Du kannst einen erstellen mit !avatar gefolgt von deiner Klasse.`;
                message += ` Mögliche klassen sind Bambusmagier, Flauschheiler, Kuschelkrieger, Bogenschütze oder Schattenläufer.`;
                sayService.say(origin, context.displayName, '', channel, message);
            }
        }

        //await avatar.addExperience(100);

        if(avatar) {
            sayService.say(origin, context.displayName, '', channel, Abenteurer.adventurerToTwitchText(avatar));
        }
    }
}

let avatarCommand = new AvatarCommand();

export default avatarCommand;