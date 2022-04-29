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
    command        = 'liebesritual';
    description    = 'Ein Liebesritual lässt alle schlechten Gedanken verschwinden';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 43200;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {

        await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .insertOne({
                identifier: `liebesritualUntil`,
                value: moment().add('20', 'minutes').format()
            });

        await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .updateOne(
                {identifier: 'hornyLevel'},
                {$set: {value: 0}},
                {upsert: true}
            );
        emitter.emit('hornyLevelChanged', 0);

        const text = 'Die große Pandagöttin ruft die Freie Liebe aus! Die Flauschebande verfällt in eine Ekstase aus ' +
            'wonnigen Küssen und wildem Gefummel! Nun brauchen die Flauschis erst mal 20 Minuten Pause, um wieder zu ' +
            'Kräften zu kommen und diverse verknotete Körperteile zu entwirren. Liebe ist toll!';

        this.say(origin, '', '', channel, text);

        return Promise.resolve(true);
    }
}

let liebesPfeilCommand = new LiebesPfeilCommand();

export default liebesPfeilCommand;