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

class BirdOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "stinkefinger";
    aliases        = ["!fu"];
    description    = "Stinkefinger";
    mediaFile      = "stinkefinger.mp4";
    mediaType      = "video";
    volume         = 1.0;
    fullscreen     = false;
    customHandler  = null;
}

let birdOverlayCommand = new BirdOverlayCommand();

export default birdOverlayCommand;