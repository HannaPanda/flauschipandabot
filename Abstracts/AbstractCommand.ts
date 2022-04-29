import emitter from "../emitter";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import Fighter from "../Models/Fighter";
import moment from "moment";
import sayService from "../Services/SayService";
import mongoDBClient from "../Clients/mongoDBClient";
dotenv.config({ path: __dirname+'/../.env' });

abstract class AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = "";
    aliases        = [];
    description    = "";
    answerNoTarget = "";
    answerTarget   = "";
    customHandler  = null;
    globalCooldown = 0;

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    protected handleEvent = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        parts[0] = parts[0].toLowerCase();

        if(parts[0] !== `!${this.command}` && !this.aliases.includes(parts[0].replace('!', ''))) {
            return Promise.resolve(false);
        }

        if(this.isModOnly && !context.mod && context.username !== process.env.CHANNEL) {
            emitter.emit(`${origin}.say`, `*bonk* ಠ_ಠ`, channel);
            return Promise.resolve(false);
        }

        if(this.isOwnerOnly && context.username !== process.env.CHANNEL) {
            emitter.emit(`${origin}.say`, `*bonk* ಠ_ಠ`, channel);
            return Promise.resolve(false);
        }

        if(!this.isModOnly) {
            const fighter = new Fighter();
            await fighter.init(context.username.toLowerCase());
            if(fighter.get('curHp') <= 0) {
                emitter.emit(`${origin}.say`, `${context['display-name']}, du bist gerade ohnmächtig und kannst keine Commands ausführen NotLikeThis Erst wenn du geheilt wurdest, geht das wieder.`, channel);
                return Promise.resolve(false);
            }
            if(!fighter.get('canUseCommands')) {
                emitter.emit(`${origin}.say`, `${context['display-name']}, du hast dich selbst verhext und kannst keine Commands ausführen NotLikeThis Da hilft nur warten.`, channel);
                return Promise.resolve(false);
            }

            if(this.isAggressive) {
                const liebesritual = await mongoDBClient
                    .db("flauschipandabot")
                    .collection("misc")
                    .findOne( {identifier: 'liebesritualUntil'}, {});

                if(liebesritual && liebesritual.value && moment().isBefore(moment(liebesritual.value)) ) {
                    const text = `###ORIGIN###: Die Flauschis erholen sich noch für ${Math.round(moment.duration(moment(liebesritual.value).diff(moment())).asMinutes())} Minuten vom letzten Liebesritual.`;
                    sayService.say(origin, context['display-name'], '', channel, text);
                    return Promise.resolve(false);
                }

                if(moment().isBefore(fighter.get('isAsleepUntil'))) {
                    const text = `###ORIGIN###: Du schläfst gerade und kannst nicht angreifen emote_sleep emote_sleep`;
                    sayService.say(origin, context['display-name'], parts.slice(1).join(' '), channel, text);
                    return Promise.resolve(false);
                }

                const target = this.getTarget(origin, parts, messageObject);
                const inLoveWith = fighter.get('inLoveWith');
                const newInLoveWith = [];
                let refuses = false;
                for(let i = 0; i < inLoveWith.length; i++) {
                    const element = inLoveWith[i];
                    if(moment().isBefore(moment(element.until))) {
                        newInLoveWith.push(element);

                        if(element.name === target) {
                            refuses = true;
                        }
                    }
                }
                await fighter.set('inLoveWith', newInLoveWith).update();
                if(refuses) {
                    const text = `###ORIGIN### ist in ###TARGET### ganz doll verflauscht und weigert sich ###TARGET### anzugreifen emote_woah emote_heart`;
                    sayService.say(origin, context['display-name'], parts.slice(1).join(' '), channel, text);
                    return Promise.resolve(false);
                }
            }
        }

        const document = await mongoDBClient
            .db("flauschipandabot")
            .collection("misc")
            .findOne( {identifier: `globalCooldown${this.command}`}, {});

        if(document && document.value) {
            if(moment().isBefore(moment(document.value))) {
                const text = `###ORIGIN###: Der Command !${this.command} ist noch im Cooldown NotLikeThis`;
                sayService.say(origin, context['display-name'], '', channel, text);
                return Promise.resolve(false);
            } else {
                await mongoDBClient
                    .db("flauschipandabot")
                    .collection("misc")
                    .deleteOne(document);
            }
        }

        if(this.globalCooldown > 0) {
            await mongoDBClient
                .db("flauschipandabot")
                .collection("misc")
                .insertOne({
                    identifier: `globalCooldown${this.command}`,
                    value: moment().add(this.globalCooldown, 'seconds').format()
                });
        }

        if(this.customHandler) {
            await this.customHandler(message, parts, context, origin, channel, messageObject);
            return Promise.resolve(true);
        } else {
            if(parts.length > 1 && this.answerTarget !== '') {
                emitter.emit(
                    `${origin}.say`,
                    this.answerTarget
                        .split('###DISPLAYNAME###').join(context['display-name'])
                        .split('###TARGET###').join(parts.slice(1).join(' '))
                        .replace(/emote_([a-zA-Z0-9]+)/g, (match, contents, offset, input_string) => {
                            return emoteService.getEmote(origin, match);
                        }),
                    channel
                );
            } else {
                emitter.emit(
                    `${origin}.say`,
                    this.answerNoTarget
                        .split('###DISPLAYNAME###').join(context['display-name'])
                        .split('###TARGET###').join(parts.slice(1).join(' '))
                        .replace(/emote_([a-zA-Z0-9]+)/g, (match, contents, offset, input_string) => {
                            return emoteService.getEmote(origin, match);
                        }),
                    channel
                );
            }

            return Promise.resolve(true);
        }
    }

    protected getTarget = (origin, parts, messageObject) => {
        let target = '';
        if(origin === 'tmi') {
            target = parts[1] ? parts[1].split('@').join('').toLowerCase() : '';
        } else if(origin === 'discord' && messageObject.mentions.users.first()) {
            target = messageObject.mentions.users.first().username.toLowerCase();
        } if(origin === 'discord' && messageObject.mentions.roles.first()) {
            target = messageObject.mentions.roles.first().name.toLowerCase();
        }

        return target;
    }

    protected randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    protected say = (origin, displayName, targetName, channel, message) => {
        emitter.emit(
            `${origin}.say`,
            message
                .split('###ORIGIN###').join(displayName)
                .split('###TARGET###').join(targetName)
                .replace(/emote_([a-zA-Z0-9]+)/g, (match, contents, offset, input_string) => {
                    return emoteService.getEmote(origin, match);
                }),
            channel
        );
    }
}

export default AbstractCommand;