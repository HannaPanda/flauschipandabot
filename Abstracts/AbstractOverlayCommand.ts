import emitter from "../emitter";
import * as dotenv from "dotenv";
import Fighter from "../Models/Fighter";
import botService from "../Services/BotService";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

abstract class AbstractOverlayCommand
{
    isActive       = true;
    isVipOnly      = false;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "";
    aliases        = [];
    description    = "";
    mediaFile      = "";
    mediaType      = "";
    volume         = 1;
    duration       = 5000;
    fullscreen     = false;
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

        if(parts[0] !== `!${this.command}` && !this.aliases.includes(parts[0])) {
            return Promise.resolve(false);
        }

        if(this.isVipOnly && !context.mod && !context.owner && !context.vip) {
            sayService.say(origin, '', '', channel, `*bonk* ಠ_ಠ`);
            return Promise.resolve(false);
        }

        if(this.isModOnly && !context.mod && !context.owner) {
            sayService.say(origin, '', '', channel, `*bonk* ಠ_ಠ`);
            return Promise.resolve(false);
        }

        if(this.isOwnerOnly && !context.owner) {
            sayService.say(origin, '', '', channel, `*bonk* ಠ_ಠ`);
            return Promise.resolve(false);
        }

        if(!this.isModOnly) {
            const fighter = new Fighter();
            await fighter.init(context.username.toLowerCase());
            if(fighter.get('curHp') <= 0) {
                const text = `###ORIGIN###, du bist gerade ohnmächtig und kannst keine Commands ausführen NotLikeThis Erst wenn du geheilt wurdest, geht das wieder.`;
                sayService.say(origin, context['display-name'], '', channel, text);
                return Promise.resolve(false);
            }
            if(!fighter.get('canUseCommands')) {
                const text = `###ORIGIN###, du hast dich selbst verhext und kannst keine Commands ausführen NotLikeThis Da hilft nur warten.`;
                sayService.say(origin, context['display-name'], '', channel, text);
                return Promise.resolve(false);
            }
        }

        if(!botService.botActive) {
            emitter.emit('bot.say', 'Nö. Einfach nur nö.');
            return Promise.resolve(false);
        }

        if(this.customHandler) {
            await this.customHandler(message, parts, context, origin, channel, messageObject);
            return Promise.resolve(true);
        } else {
            switch(this.mediaType) {
                case 'video':
                    emitter.emit('playVideo', {file: this.mediaFile, mediaType: this.mediaType, volume: this.volume, fullscreen: this.fullscreen});
                    break;
                case 'audio':
                    emitter.emit('playAudio', {file: this.mediaFile, mediaType: this.mediaType, volume: this.volume, fullscreen: this.fullscreen});
                    break;
                case 'image':
                    emitter.emit('showImage', {file: this.mediaFile, mediaType: this.mediaType, volume: this.volume, duration: this.duration});
                    break;
            }

            return Promise.resolve(true);
        }
    }

}

export default AbstractOverlayCommand;