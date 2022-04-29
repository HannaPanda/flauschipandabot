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

class FucksOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "fucks";
    description    = "No fucks given";
    mediaFile      = "behold.mp4";
    mediaType      = "video";
    volume         = 0.25;
    fullscreen     = true;
    customHandler  = null;
}

let fucksOverlayCommand = new FucksOverlayCommand();

export default fucksOverlayCommand;