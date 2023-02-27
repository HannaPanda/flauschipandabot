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

class ZiegeOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "ziege";
    description    = "BleBleBleBleBleBleBleBleBle";
    mediaFile      = "ziege.mp4";
    mediaType      = "video";
    volume         = 0.5;
    customHandler  = null;
}

let ziegeOverlayCommand = new ZiegeOverlayCommand();

export default ziegeOverlayCommand;