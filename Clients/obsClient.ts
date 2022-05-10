import {ChatUserstate, Client} from "tmi.js";
import emitter from "../emitter";
import * as dotenv from "dotenv";
import OBSWebSocket from "obs-websocket-js";
import tmiOwnerClient from "./tmiOwnerClient";
import sayService from "../Services/SayService";
import twitchClient from "./twitchClient";

const tmi = require('tmi.js');
dotenv.config({ path: __dirname+'/../.env' });

class Initializer
{
    public obs: OBSWebSocket;

    constructor()
    {
        this.obs = new OBSWebSocket();
        this.connectObs();
    }

    private connectObs = () => {
        this.obs.connect({ address: 'localhost:4444', password: process.env.OBS_WS_PASS })
            .then(() => {
                console.log('OBS connected');
                // Partner only?
                this.obs.on('SwitchScenes', data => {
                    if(data['scene-name'] === 'Bitte Warten') {
                        twitchClient.startCommercial(120)

                        sayService.say('tmi', '', '', null, `Werbepause! ヾ(ﾟдﾟ)ﾉ`);
                    }
                });
                this.obs.on('ConnectionClosed', data => {
                    this.obs.removeAllListeners();
                    setTimeout(this.connectObs, 1000);
                });
            })
            .catch((err) => {
                //console.warn(err);
                //console.warn('OBS not connected');
                this.obs.removeAllListeners();
                setTimeout(this.connectObs, 1000);
            });
    }
}

let initializer = new Initializer();

export default initializer.obs;