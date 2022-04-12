import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import emoteService from "../Services/EmoteService";
import sayService from "../Services/SayService";
import {random} from "twing/dist/types/lib/extension/core/functions/random";
dotenv.config({ path: __dirname+'/../.env' });

class QuoteCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = 'quote';
    description    = 'Zitate ausgeben und speichern. !quote [ add | replace | approve | delete ] ID ';
    answerNoTarget = '';
    answerTarget   = '';

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const isMod = context.mod || context.username === process.env.CHANNEL;

        // https://decapi.me/twitch/followage/hannapanda84/anubisbln erlauben bei 100+ Stunden

        if(parts.length >= 3) {
            if(parts[1] === 'add') {
                const quote = parts.slice(2).join(' ');

                const highestQuote = await mongoDBClient
                    .db("flauschipandabot")
                    .collection("quotes")
                    .find()
                    .sort({id:-1})
                    .limit(1)
                    .next();

                const curQuoteCount = highestQuote.id;

                mongoDBClient
                    .db("flauschipandabot")
                    .collection("quotes")
                    .insertOne({
                        id:         curQuoteCount + 1,
                        quote:      quote,
                        date:       new Date().toLocaleDateString('de-DE'),
                        isApproved: isMod
                    });

                const text = `###ORIGIN###: Zitat #${curQuoteCount + 1} wurde hinzugefügt`;
                sayService.say(origin, context['display-name'], '', channel, text);
            } else if(parts[1] === 'replace' && isMod) {
                const id = parseInt(parts[2]);
                const quote = parts.slice(3).join(' ');

                const document = await mongoDBClient
                    .db("flauschipandabot")
                    .collection("quotes")
                    .findOne({id: id}, {});

                if(document) {
                    await mongoDBClient
                        .db("flauschipandabot")
                        .collection("quotes")
                        .updateOne(
                            {id: id},
                            {
                                $set: {
                                    quote: quote
                                }
                            }
                        );

                    const text = `###ORIGIN###: Zitat Nummer #${id} wurde geändert`;
                    sayService.say(origin, context['display-name'], '', channel, text);
                } else {
                    const text = `###ORIGIN###: Es wurde kein Zitat mit der Nummer #${id} gefunden`;
                    sayService.say(origin, context['display-name'], '', channel, text);
                }
            } else if(parts[1] === 'approve' && isMod) {
                const id = parseInt(parts[2]);

                const document = await mongoDBClient
                    .db("flauschipandabot")
                    .collection("quotes")
                    .findOne({id: id}, {});

                if(document) {
                    await mongoDBClient
                        .db("flauschipandabot")
                        .collection("quotes")
                        .updateOne(
                            {id: id},
                            {
                                $set: {
                                    approved: true
                                }
                            }
                        );

                    const text = `###ORIGIN###: Zitat Nummer #${id} wurde genehmigt`;
                    sayService.say(origin, context['display-name'], '', channel, text);
                } else {
                    const text = `###ORIGIN###: Es wurde kein Zitat mit der Nummer #${id} gefunden`;
                    sayService.say(origin, context['display-name'], '', channel, text);
                }
            } else if(parts[1] === 'delete' && isMod) {
                const id = parseInt(parts[2]);

                const document = await mongoDBClient
                    .db("flauschipandabot")
                    .collection("quotes")
                    .findOne({id: id}, {});

                if(document) {
                    await mongoDBClient
                        .db("flauschipandabot")
                        .collection("quotes")
                        .deleteOne({id: id}, {});

                    const text = `###ORIGIN###: Zitat Nummer #${id} wurde gelöscht`;
                    sayService.say(origin, context['display-name'], '', channel, text);
                } else {
                    const text = `###ORIGIN###: Es wurde kein Zitat mit der Nummer #${id} gefunden`;
                    sayService.say(origin, context['display-name'], '', channel, text);
                }
            }
        } else if(parts.length === 2) {
            const id = parseInt(parts[1]);
            const document = await mongoDBClient
                .db("flauschipandabot")
                .collection("quotes")
                .findOne({id: id, isApproved: true}, {});

            if(document) {
                const text = `###ORIGIN### Zitat #${document.id}: ${document.quote}`;
                sayService.say(origin, context['display-name'], '', channel, text);
            } else if(id === 69) {
                const text = `###ORIGIN###: Nice!`;
                sayService.say(origin, context['display-name'], '', channel, text);
            } else {
                const text = `###ORIGIN###: Es wurde kein Zitat mit der Nummer #${id} gefunden`;
                sayService.say(origin, context['display-name'], '', channel, text);
            }
        } else {
            const randomQuote = await mongoDBClient
                .db("flauschipandabot")
                .collection("quotes")
                .aggregate([{$sample: {size: 1}}, {$match: {isApproved: true}}])
                .next();

            if(randomQuote) {
                const text = `###ORIGIN### Zitat #${randomQuote.id}: ${randomQuote.quote} [${randomQuote.date}]`;
                sayService.say(origin, context['display-name'], '', channel, text);
            }
        }
    };
}

let quoteCommand = new QuoteCommand();

export default quoteCommand;