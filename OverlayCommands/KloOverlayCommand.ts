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

class KloOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "klo";
    aliases        = [];
    description    = "Wenn man mal muss";
    mediaFile      = "klo1.mp3";
    mediaType      = "audio";
    volume         = 0.5;
    customHandler  = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const sounds = ['klo1.mp3', 'klo2.mp3', 'klo3.mp3', 'klo4.mp3',];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        emitter.emit('playAudio', {file: randomSound, mediaType: 'audio', volume: this.volume});
    };

    delay = async (ms: number) => {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}

let kloOverlayCommand = new KloOverlayCommand();

export default kloOverlayCommand;