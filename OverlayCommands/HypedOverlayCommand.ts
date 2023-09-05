import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import statusService from "../Services/StatusService";
import fetch from "node-fetch";
import sayService from "../Services/SayService";
import AbstractOverlayCommand from "../Abstracts/AbstractOverlayCommand";
import server from "../server";
dotenv.config({ path: __dirname+'/../.env' });

class HypedOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "hyped";
    aliases        = [];
    description    = "LET'S GOOOOOOOOOOOO";
    mediaFile      = "";
    mediaType      = "image";
    volume         = 1;
    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        server.getIO().emit('showImage', {file: 'hyper-excited.gif', mediaType: 'image', duration: 2000});
        server.getIO().emit('playAudio', {file: 'hyped.mp3', mediaType: 'audio', volume: 0.1});
    };
}

let hypedOverlayCommand = new HypedOverlayCommand();

export default hypedOverlayCommand;