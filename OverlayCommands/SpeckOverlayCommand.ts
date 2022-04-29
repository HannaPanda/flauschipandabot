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

class SpeckOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "speck";
    description    = "Das ist kein Speck";
    mediaFile      = "speck.wav";
    mediaType      = "audio";
    volume         = 0.1;
    customHandler  = null;
}

let speckOverlayCommand = new SpeckOverlayCommand();

export default speckOverlayCommand;