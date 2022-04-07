import emitter from "../emitter";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import Fighter from "../Models/Fighter";
dotenv.config({ path: __dirname+'/../.env' });

abstract class AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    command        = "";
    description    = "";
    answerNoTarget = "";
    answerTarget   = "";
    customHandler  = null;

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    protected handleEvent = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        parts[0] = parts[0].toLowerCase();

        if(parts[0] === `!commands` && !this.isModOnly) {
            emitter.emit(`${origin}.say`, `!${this.command}: ${this.description}`, channel);
            return Promise.resolve(false);
        }

        if(parts[0] !== `!${this.command}`) {
            return Promise.resolve(false);
        }

        if(this.isModOnly && !context.mod && context.username !== process.env.CHANNEL) {
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