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

class LiebesPfeilCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'liebespfeil';
    description    = 'Sei Amor und lass sich jemanden verlieben';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 600;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {

        const target = this.getTarget(origin, parts, messageObject);
        const username = context.userName;
        const targetName = parts.slice(1).join(' ');

        const fetch = require('node-fetch');
        const chatterInfo = await fetch(`https://tmi.twitch.tv/group/user/${process.env.CHANNEL}/chatters`, {method: "Get"})
            .then(res => res.json())
            .catch(err => {console.log(err)});

        if(chatterInfo && chatterInfo.chatters && target !== '') {
            const chatters = [].concat(...Object.values(chatterInfo.chatters));

            if(targetName === '') {
                const text = `###ORIGIN### schießt mit Liebespfeilen um sich, trifft aber niemanden`;
                sayService.say(origin, context.displayName, targetName, channel, text);
            } else {
                let randomUser = await mongoDBClient
                    .db("flauschipandabot")
                    .collection("fighters")
                    .aggregate([{$match: {name: { $in: chatters, $ne: target }}}, { $sample: { size: 1 } }])
                    .next();

                const targetUser = new Fighter();
                await targetUser.init(target);

                const inLoveWith = targetUser.get('inLoveWith');
                inLoveWith.push({name: randomUser.name, until: moment().add(10, 'minutes').format()});
                await targetUser.set('inLoveWith', inLoveWith).update();

                const text = `###ORIGIN### trifft ###TARGET### mit einem Liebespfeil. ###TARGET### verliebt sich in ${randomUser.name} emote_woah und weigert sich nun, ${randomUser.name} etwas anzutun emote_heart.`;
                sayService.say(origin, context.displayName, targetName, channel, text);
            }
        } else {
            const text = `###ORIGIN### schießt mit Liebespfeilen um sich, trifft aber niemanden`;
            sayService.say(origin, context.displayName, targetName, channel, text);
        }

        return Promise.resolve(true);
    }
}

let liebesPfeilCommand = new LiebesPfeilCommand();

export default liebesPfeilCommand;