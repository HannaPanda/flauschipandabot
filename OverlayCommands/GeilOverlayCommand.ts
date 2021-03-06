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

class GeilOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "geil";
    aliases        = [];
    description    = "GEIL!";
    mediaFile      = "geil.wav";
    mediaType      = "audio";
    volume         = 0.25;
    customHandler  = null;
}

let geilOverlayCommand = new GeilOverlayCommand();

export default geilOverlayCommand;