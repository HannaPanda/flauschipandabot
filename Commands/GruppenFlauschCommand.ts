import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import emoteService from "../Services/EmoteService";
import sayService from "../Services/SayService";
import server from "../server";
dotenv.config({ path: __dirname+'/../.env' });

class GruppenFlauschCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'gruppenflausch';
    description    = 'GRUPPENFLAUSCH!';
    answerNoTarget = 'emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart' +
        ' Gruppenflausch!' +
        ' emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart emote_heart';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        let allUsers = await mongoDBClient
            .db("flauschipandabot")
            .collection("fighters")
            .find();

        while(await allUsers.hasNext()) {
            const user = await allUsers.next();
            this.healFighter(user.name);
        }

        sayService.say(origin, '', '', channel, this.answerNoTarget);
        server.getIO().emit('showImage', {file: 'alerts/follower.gif', mediaType: 'image', duration: 5000});
        server.getIO().emit('playAudio', {file: 'yoba.wav', mediaType: 'audio', volume: 0.5});
    }

    healFighter = async (username) => {
        const fighter = new Fighter();
        await fighter.init(username);
        if(!fighter.get('disease') && !fighter.get('incurableDisease')) {
            await fighter.set('curHp', fighter.get('maxHp')).update();
        }

        return Promise.resolve(true);
    }
}

let gruppenFlauschCommand = new GruppenFlauschCommand();

export default gruppenFlauschCommand;