import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import knochenCommand from "./KnochenCommand";
import Fighter from "../Models/Fighter";
import mongoDBClient from "../Clients/mongoDBClient";
import fetch from "node-fetch";
import sayService from "../Services/SayService";
import {random} from "twing/dist/types/lib/extension/core/functions/random";
import moment from "moment";
dotenv.config({ path: __dirname+'/../.env' });

class SchlafblumenCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'schlafblumen';
    description    = 'Bringe jemanden zum Schlafen';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 600;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {

        const target = this.getTarget(origin, parts, messageObject);
        const username = context.username.toLowerCase();
        const targetName = parts.slice(1).join(' ');

        if(targetName === '') {
            const text = `###ORIGIN### schmeißt mit Blüten um sich`;
            sayService.say(origin, context['display-name'], targetName, channel, text);
        } else {
            const targetUser = new Fighter();
            await targetUser.init(target);

            await targetUser.set('isAsleepUntil', moment().add(5, 'minutes').format()).set('curHp', targetUser.get('maxHp')).update();

            const text = `###ORIGIN### streut eine Hand voll Schlafblumen auf ###TARGET###. ###TARGET### fällt für 5 Minuten in einen flauschigen Schlaf und wird dabei voll geheilt. emote_sleep emote_sleep emote_sleep emote_sleep `;
            sayService.say(origin, context['display-name'], targetName, channel, text);
        }

        return Promise.resolve(true);
    }
}

let schlafblumenCommand = new SchlafblumenCommand();

export default schlafblumenCommand;