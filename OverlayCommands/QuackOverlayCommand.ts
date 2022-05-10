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

class QuackOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "quack";
    aliases        = [];
    description    = "Quack!";
    mediaFile      = "quack.mp3";
    mediaType      = "audio";
    volume         = 0.25;
    customHandler  = null/*async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const numberPattern = /\d+/g;
        const numbers = parts.slice(1).join(' ').match( numberPattern );
        const number = (numbers) ? numbers.join('') : '';
        const numberOfPlays = (number !== '' && parseInt(number) > 0) ? parseInt(number) : 1;

        for(let i = 0; i < numberOfPlays; i++) {
            emitter.emit('playAudio', {file: this.mediaFile, mediaType: 'audio', volume: (numberOfPlays > 1) ? 0.05 : this.volume});
        }
    }*/;
}

let quackOverlayCommand = new QuackOverlayCommand();

export default quackOverlayCommand;