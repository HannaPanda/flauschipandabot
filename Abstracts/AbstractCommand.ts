import emitter from "../emitter";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import Fighter from "../Models/Fighter";
import moment from "moment";
import sayService from "../Services/SayService";
import mongoDBClient from "../Clients/mongoDBClient";
import botService from "../Services/BotService";
import server from "../server";
import openAiClient from "../Clients/openAiClient";
import {MiscModel} from "../Models/Misc";
dotenv.config({ path: __dirname+'/../.env' });

abstract class AbstractCommand
{
    isActive       = true;
    isVipOnly      = false;
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

        if(parts[0] !== `!${this.command}` && !this.aliases.includes(parts[0])) {
            return Promise.resolve(false);
        }

        if(this.isVipOnly && !context.mod && !context.owner && !context.vip) {
            sayService.say(origin, '', '', channel, `Dieser Befehl ist leider nur für VIPs verfügbar`);
            return Promise.resolve(false);
        }

        if(this.isModOnly && !context.mod && !context.owner) {
            sayService.say(origin, '', '', channel, `Dieser Befehl ist leider nur für Mods verfügbar`);
            return Promise.resolve(false);
        }

        if(this.isOwnerOnly && !context.owner) {
            sayService.say(origin, '', '', channel, `Dieser Befehl ist leider nur für Hanna verfügbar`);
            return Promise.resolve(false);
        }

        if(!this.isModOnly) {
            const fighter = new Fighter();
            await fighter.init(context.userName);
            if(fighter.get('curHp') <= 0) {
                const text = `###ORIGIN###, du bist gerade ohnmächtig und kannst keine Commands ausführen NotLikeThis Erst wenn du geheilt wurdest, geht das wieder.`;
                sayService.say(origin, context.displayName, '', channel, text);
                return Promise.resolve(false);
            }
            if(!fighter.get('canUseCommands')) {
                const text = `###ORIGIN###, du hast dich selbst verhext und kannst keine Commands ausführen NotLikeThis Da hilft nur warten.`;
                sayService.say(origin, context.displayName, '', channel, text);
                return Promise.resolve(false);
            }

            if(this.isAggressive) {
                const liebesritual = await MiscModel.findOne({ identifier: 'liebesritualUntil' });

                if (liebesritual) {
                    if (liebesritual.value && moment().isBefore(moment(liebesritual.value))) {
                        const remainingMinutes = Math.round(moment.duration(moment(liebesritual.value).diff(moment())).asMinutes());
                        const text = `###ORIGIN###: Die Flauschis erholen sich noch für ${remainingMinutes} Minuten vom letzten Liebesritual.`;
                        sayService.say(origin, context.displayName, '', channel, text);
                        return Promise.resolve(false);
                    } else {
                        await MiscModel.deleteOne({identifier: 'liebesritualUntil'});
                    }
                }

                if(moment().isBefore(fighter.get('isAsleepUntil'))) {
                    const text = `###ORIGIN###: Du schläfst gerade und kannst nicht angreifen emote_sleep emote_sleep`;
                    sayService.say(origin, context.displayName, parts.slice(1).join(' '), channel, text);
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
                    sayService.say(origin, context.displayName, parts.slice(1).join(' '), channel, text);
                    return Promise.resolve(false);
                }
            }
        }

        const document = await MiscModel.findOne({ identifier: `globalCooldown${this.command}` });

        if (document && document.value) {
            if (moment().isBefore(moment(document.value))) {
                const text = `###ORIGIN###: Der Command !${this.command} ist noch im Cooldown NotLikeThis`;
                sayService.say(origin, context.displayName, '', channel, text);
                return Promise.resolve(false);
            } else {
                await MiscModel.deleteOne({ _id: document._id });
            }
        }

        if (!botService.botActive) {
            openAiClient.botSay('Ich habe keine Lust. Ich schmolle jetzt.');
            return Promise.resolve(false);
        }

        if (this.globalCooldown > 0) {
            await MiscModel.create({
                identifier: `globalCooldown${this.command}`,
                value: moment().add(this.globalCooldown, 'seconds').toDate()
            });
        }

        if(this.customHandler) {
            await this.customHandler(message, parts, context, origin, channel, messageObject);
            return Promise.resolve(true);
        } else {
            if(parts.length > 1 && this.answerTarget !== '') {
                sayService.say(origin, context.displayName, parts.slice(1).join(' '), channel, this.answerTarget);
            } else {
                sayService.say(origin, context.displayName, parts.slice(1).join(' '), channel, this.answerNoTarget);
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
}

export default AbstractCommand;