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

class RunOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "bier";
    aliases        = ["!buy"];
    description    = "Ein kühles Blondes";
    mediaFile      = "bier.wav";
    mediaType      = "audio";
    volume         = 0.25;
    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        if(message.startsWith("!bier ") || message.startsWith("!buy bier ") || message.startsWith("!buy use bier ")) {
            emitter.emit('playAudio', {file: this.mediaFile, mediaType: 'audio', volume: this.volume});
        }
    };
}

let runOverlayCommand = new RunOverlayCommand();

export default runOverlayCommand;