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

class BatmanOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "batman";
    aliases        = [];
    description    = "Ich bin Batman!";
    mediaFile      = "batman.mp3";
    mediaType      = "audio";
    volume         = 0.5;
    customHandler  = null;
}

let batmanOverlayCommand = new BatmanOverlayCommand();

export default batmanOverlayCommand;