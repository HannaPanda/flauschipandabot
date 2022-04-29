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

class FlipOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "flip";
    aliases        = ["tableflip"];
    description    = "Table Flip";
    mediaFile      = "flip.mp4";
    mediaType      = "video";
    volume         = 0.25;
    customHandler  = null;
}

let flipOverlayCommand = new FlipOverlayCommand();

export default flipOverlayCommand;