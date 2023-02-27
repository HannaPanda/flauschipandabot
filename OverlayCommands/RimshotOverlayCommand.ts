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

class RimshotOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "badum";
    aliases        = ['!rimshot', '!joke', '!corny'];
    description    = "Badum Tss";
    mediaFile      = "badumtss.mp3";
    mediaType      = "audio";
    volume         = 0.5;
    customHandler  = null;
}

let rimshotOverlayCommand = new RimshotOverlayCommand();

export default rimshotOverlayCommand;