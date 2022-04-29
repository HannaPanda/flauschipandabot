import emitter from "../emitter";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import Fighter from "../Models/Fighter";
dotenv.config({ path: __dirname+'/../.env' });

abstract class AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "";
    aliases        = [];
    description    = "";
    mediaFile      = "";
    mediaType      = "";
    volume         = 1;
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
                    emitter.emit('showImage', {file: this.mediaFile, mediaType: this.mediaType, volume: this.volume});
                    break;
            }

            return Promise.resolve(true);
        }
    }

}

export default AbstractOverlayCommand;