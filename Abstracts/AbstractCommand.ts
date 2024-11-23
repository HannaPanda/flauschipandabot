import { eventManager, ChatMessageEvent } from "../Services/EventManager";
import * as dotenv from "dotenv";
import { Message } from "discord.js";
import Fighter from "../Models/Fighter";
import moment from "moment";
import sayService from "../Services/SayService";
import botService from "../Services/BotService";
import openAiClient from "../Clients/openAiClient";
import { MiscModel } from "../Models/Misc";
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
        eventManager.onChatMessage(this.handleEvent);
    }

    protected handleEvent = async (event: ChatMessageEvent) => {
        const { message, tokens, user, platform, channel, rawMessage } = event;

        if(!this.isActive) {
            return Promise.resolve(false);
        }

        tokens[0] = tokens[0].toLowerCase();

        if(tokens[0] !== `!${this.command}` && !this.aliases.includes(tokens[0])) {
            return Promise.resolve(false);
        }

        if(this.isVipOnly && !user.mod && !user.owner && !user.vip) {
            sayService.say(platform, '', '', channel, `Dieser Befehl ist leider nur für VIPs verfügbar`);
            return Promise.resolve(false);
        }

        if(this.isModOnly && !user.mod && !user.owner) {
            sayService.say(platform, '', '', channel, `Dieser Befehl ist leider nur für Mods verfügbar`);
            return Promise.resolve(false);
        }

        if(this.isOwnerOnly && !user.owner) {
            sayService.say(platform, '', '', channel, `Dieser Befehl ist leider nur für Hanna verfügbar`);
            return Promise.resolve(false);
        }

        if(!this.isModOnly) {
            const fighter = new Fighter();
            await fighter.init(user.userName);
            if(fighter.get('curHp') <= 0) {
                const text = `###platform###, du bist gerade ohnmächtig und kannst keine Commands ausführen NotLikeThis Erst wenn du geheilt wurdest, geht das wieder.`;
                sayService.say(platform, user.displayName, '', channel, text);
                return Promise.resolve(false);
            }
            if(!fighter.get('canUseCommands')) {
                const text = `###platform###, du hast dich selbst verhext und kannst keine Commands ausführen NotLikeThis Da hilft nur warten.`;
                sayService.say(platform, user.displayName, '', channel, text);
                return Promise.resolve(false);
            }

            if(this.isAggressive) {
                const liebesritual = await MiscModel.findOne({ identifier: 'liebesritualUntil' });

                if (liebesritual) {
                    if (liebesritual.value && moment().isBefore(moment(liebesritual.value))) {
                        const remainingMinutes = Math.round(moment.duration(moment(liebesritual.value).diff(moment())).asMinutes());
                        const text = `###platform###: Die Flauschis erholen sich noch für ${remainingMinutes} Minuten vom letzten Liebesritual.`;
                        sayService.say(platform, user.displayName, '', channel, text);
                        return Promise.resolve(false);
                    } else {
                        await MiscModel.deleteOne({identifier: 'liebesritualUntil'});
                    }
                }

                if(moment().isBefore(fighter.get('isAsleepUntil'))) {
                    const text = `###platform###: Du schläfst gerade und kannst nicht angreifen emote_sleep emote_sleep`;
                    sayService.say(platform, user.displayName, tokens.slice(1).join(' '), channel, text);
                    return Promise.resolve(false);
                }

                const target = this.getTarget(platform, tokens, rawMessage);
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
                    const text = `###platform### ist in ###TARGET### ganz doll verflauscht und weigert sich ###TARGET### anzugreifen emote_woah emote_heart`;
                    sayService.say(platform, user.displayName, tokens.slice(1).join(' '), channel, text);
                    return Promise.resolve(false);
                }
            }
        }

        const document = await MiscModel.findOne({ identifier: `globalCooldown${this.command}` });

        if (document && document.value) {
            if (moment().isBefore(moment(document.value))) {
                const text = `###platform###: Der Command !${this.command} ist noch im Cooldown NotLikeThis`;
                sayService.say(platform, user.displayName, '', channel, text);
                return Promise.resolve(false);
            } else {
                await MiscModel.deleteOne({ _id: document._id });
            }
        }

        if (!botService.botActive) {
            openAiClient.botSay('Ich habe keine Lust. Ich schmolle jetzt.').catch(err => console.log(err));
            return Promise.resolve(false);
        }

        if (this.globalCooldown > 0) {
            await MiscModel.create({
                identifier: `globalCooldown${this.command}`,
                value: moment().add(this.globalCooldown, 'seconds').toDate()
            });
        }

        if(this.customHandler) {
            await this.customHandler(message, tokens, user, platform, channel, rawMessage);
            return Promise.resolve(true);
        } else {
            if(tokens.length > 1 && this.answerTarget !== '') {
                sayService.say(platform, user.displayName, tokens.slice(1).join(' '), channel, this.answerTarget);
            } else {
                sayService.say(platform, user.displayName, tokens.slice(1).join(' '), channel, this.answerNoTarget);
            }

            return Promise.resolve(true);
        }
    }

    protected getTarget = (platform: string, tokens: Array<string>, rawMessage: Message|null) => {
        let target = '';
        if(platform === 'twitch') {
            target = tokens[1] ? tokens[1].split('@').join('').toLowerCase() : '';
        } else if(platform === 'discord' && rawMessage.mentions.users.first()) {
            target = rawMessage.mentions.users.first().username.toLowerCase();
        } if(platform === 'discord' && rawMessage.mentions.roles.first()) {
            target = rawMessage.mentions.roles.first().name.toLowerCase();
        }

        return target;
    }

    protected randomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

export default AbstractCommand;
