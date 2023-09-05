import emitter from "../emitter";
import * as dotenv from "dotenv";
import * as fs from 'fs';
import Fighter from "../Models/Fighter";
import botService from "../Services/BotService";
import sayService from "../Services/SayService";
import server from "../server";
dotenv.config({ path: __dirname+'/../.env' });

class StandardOverlayCommand
{
    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    protected handleEvent = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        try {
            var normalizedPath = require("path").join(__dirname, "..", "Config", "OverlayCommands.json");
            const data = fs.readFileSync(normalizedPath, 'utf-8');
            const jsonObj = JSON.parse(data);

            let res;
            jsonObj.forEach(res = async (command) => {

                if(!command.isActive) {
                    return Promise.resolve(false);
                }

                parts[0] = parts[0].toLowerCase();

                if(parts[0] !== `!${command.command}` && !command.aliases.includes(parts[0])) {
                    return Promise.resolve(false);
                }

                if(command.isVipOnly && !context.mod && !context.owner && !context.vip) {
                    sayService.say(origin, '', '', channel, `Dieser Befehl ist leider nur für VIPs verfügbar`);
                    return Promise.resolve(false);
                }

                if(command.isModOnly && !context.mod && !context.owner) {
                    sayService.say(origin, '', '', channel, `Dieser Befehl ist leider nur für Mods verfügbar`);
                    return Promise.resolve(false);
                }

                if(command.isOwnerOnly && !context.owner) {
                    sayService.say(origin, '', '', channel, `Dieser Befehl ist leider nur für Hanna verfügbar`);
                    return Promise.resolve(false);
                }

                if(!command.isModOnly) {
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
                }

                if(!botService.botActive) {
                    server.getIO().emit('bot.say', 'Nö. Einfach nur nö.');
                    return Promise.resolve(false);
                }

                let numberOfPlays = 1;
                let maxNumberOfPlays = 10;
                let delay = 500;
                let minDelay = 100;

                if(command.isRepeatable) {
                    const numberPattern = /\d+/g;

                    const firstNumber = parts[1]?.match(numberPattern) ?? '1';
                    numberOfPlays = Math.min(maxNumberOfPlays, (firstNumber !== '' && parseInt(firstNumber) > 0) ? parseInt(firstNumber) : 1);

                    const secondNumber = parts[2]?.match(numberPattern) ?? '500';
                    delay = Math.max(minDelay, Math.min(1000, (secondNumber !== '' && parseInt(secondNumber) > 0) ? parseInt(secondNumber) : 500));
                }

                for(let i = 0; i < numberOfPlays; i++) {
                    await this.delay(delay);
                    switch(command.mediaType) {
                        case 'video':
                            server.getIO().emit('playVideo', {file: command.mediaFile, mediaType: command.mediaType, volume: (numberOfPlays > 1) ? 0.25 : command.volume, fullscreen: command.fullscreen});
                            break;
                        case 'audio':
                            server.getIO().emit('playAudio', {file: command.mediaFile, mediaType: command.mediaType, volume: (numberOfPlays > 1) ? 0.25 : command.volume, fullscreen: command.fullscreen});
                            break;
                        case 'image':
                            server.getIO().emit('showImage', {file: command.mediaFile, mediaType: command.mediaType, volume: (numberOfPlays > 1) ? 0.25 : command.volume, duration: command.duration});
                            break;
                    }
                }

                return Promise.resolve(true);
            });
        } catch (err) {
            console.error(err);
        }

        return Promise.resolve(false);
    };

    delay = async (ms: number) => {
        return new Promise( resolve => setTimeout(resolve, ms) );
    };

}


let standardOverlayCommand = new StandardOverlayCommand();

export default standardOverlayCommand;