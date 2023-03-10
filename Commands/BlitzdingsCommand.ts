import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import mongoDBClient from "../Clients/mongoDBClient";
dotenv.config({ path: __dirname+'/../.env' });

class BlitzdingsCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'blitzdings';
    description    = 'Wenn man mal etwas vergessen muss';
    answerNoTarget = '###ORIGIN### blitzdingst sich mal eben schnell selbst ins Mittelalter';
    answerTarget   = '###ORIGIN### setzt sich lässig eine Sonnenbrille auf und blitzdingst ###TARGET###\'s Verstand in\'s Gestern';
    globalCooldown = 0;
    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        if(context['username'] === 'hannapanda84' && parts.slice(1).join(' ').toLowerCase() === '@flauschipandabot') {
            await mongoDBClient
                .db("flauschipandabot")
                .collection("chatdatabase")
                .deleteMany({});
        }

        if(parts.length > 1 && this.answerTarget !== '') {
            sayService.say(origin, context['display-name'], parts.slice(1).join(' '), channel, this.answerTarget);
        } else {
            sayService.say(origin, context['display-name'], parts.slice(1).join(' '), channel, this.answerNoTarget);
        }
    };
}

let blitzdingsCommand = new BlitzdingsCommand();

export default blitzdingsCommand;