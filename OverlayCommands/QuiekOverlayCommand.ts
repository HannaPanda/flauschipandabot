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

class QuiekOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "quiek";
    description    = "Quiek!";
    mediaFile      = "quiek.mp4";
    mediaType      = "video";
    volume         = 1;
    fullscreen     = false;
    customHandler  = null;
}

let quiekOverlayCommand = new QuiekOverlayCommand();

export default quiekOverlayCommand;