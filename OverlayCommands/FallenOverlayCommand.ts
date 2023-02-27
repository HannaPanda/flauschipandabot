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

class FallenOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "fallen";
    description    = "Ich bin hingefallen...";
    mediaFile      = "fallen.mp3";
    mediaType      = "audio";
    volume         = 1.0;
    customHandler  = null;
}

let fallenOverlayCommand = new FallenOverlayCommand();

export default fallenOverlayCommand;