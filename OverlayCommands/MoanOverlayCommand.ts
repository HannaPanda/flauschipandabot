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

class MoanOverlayCommand extends AbstractOverlayCommand
{
    isActive       = false;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "moan";
    aliases        = ["!stöhn", "!stöhnen"];
    description    = ";)";
    mediaFile      = "";//"moan.mp3";
    mediaType      = "audio";
    volume         = 0.25;
    customHandler  = null;
}

let moanOverlayCommand = new MoanOverlayCommand();

export default moanOverlayCommand;