import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import statusService from "../Services/StatusService";
import fetch from "node-fetch";
import sayService from "../Services/SayService";
import AbstractOverlayCommand from "../Abstracts/AbstractOverlayCommand";
dotenv.config({ path: __dirname+'/../.env' });

class FartOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "fart";
    aliases        = [];
    description    = "Pupsi";
    mediaFile      = "fart1.mp3";
    mediaType      = "audio";
    volume         = 0.5;
    customHandler  = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const sounds = ['fart1.mp3', 'fart2.mp3', 'fart3.mp3', 'fart4.mp3',];


        const numberPattern = /\d+/g;
        const numbers = parts.slice(1).join(' ').match( numberPattern );
        const number = (numbers) ? numbers.join('') : '';
        let numberOfPlays = Math.min(50, (number !== '' && parseInt(number) > 0) ? parseInt(number) : 1);

        for(let i = 0; i < numberOfPlays; i++) {
            await this.delay(500);
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            emitter.emit('playAudio', {file: randomSound, mediaType: 'audio', volume: this.volume});
        }
    };

    delay = async (ms: number) => {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}

let fartOverlayCommand = new FartOverlayCommand();

export default fartOverlayCommand;