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

class FrechOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "frech";
    aliases        = [];
    description    = "Frech";
    mediaFile      = "";
    mediaType      = "image";
    volume         = 1;
    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        emitter.emit('showImage', {file: 'frech.png', mediaType: 'image', duration: 2000});
        emitter.emit('bot.say', 'Frech!');
    };
}

let frechOverlayCommand = new FrechOverlayCommand();

export default frechOverlayCommand;