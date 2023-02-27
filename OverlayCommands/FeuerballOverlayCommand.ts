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

class FeuerballOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "feuerball";
    aliases        = [];
    description    = "So ein großer Feuerball, Junge!";
    mediaFile      = "feueball.mp3";
    mediaType      = "audio";
    volume         = 0.5;
}

let feuerballOverlayCommand = new FeuerballOverlayCommand();

export default feuerballOverlayCommand;