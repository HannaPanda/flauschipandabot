import TwitchApi from "node-twitch";
//@ts-ignore
import OBSWebSocket from "obs-websocket-js";

import * as dotenv from "dotenv";
import emitter from "./emitter";
import tmiClient from "./Clients/tmiClient";
import tmiOwnerClient from "./Clients/tmiOwnerClient";
import mongoDBClient from "./Clients/mongoDBClient";
import discordClient from "./Clients/discordClient";
import {TextChannel} from "discord.js";
import streamService from "./Services/StreamService";
import obsClient from "./Clients/obsClient";
dotenv.config({ path: __dirname+'/.env' });
declare var process : {
    env: {
        CLIENT_ID: string,
        CLIENT_SECRET: string,
        OBS_WS_PASS: string,
        BOT_USERNAME: string,
        BOT_PASS: string,
        OWNER_USERNAME: string,
        OWNER_PASS: string,
        CHANNEL: string,
        MONGODB_CONNECTION_STRING: string,
        BOT_DISCORD_CLIENT_TOKEN: string,
        DISCORD_GUILD_ID: string
    }
}

class FlauschiPandaBot
{
    public twitchApi: TwitchApi;
    public obs: OBSWebSocket;

    private currentStream: any = null;

    private events: Array<any> = [];

    constructor()
    {
        discordClient.eventNames();

        this.twitchApi = new TwitchApi({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        this.obs = obsClient;

        /*this.obs = new OBSWebSocket();
        this.connectObs();*/

        setInterval(this.getStreamInfo, 30000);
        setInterval(this.mentionModSearch, 3600000*3);
        setInterval(this.mentionTwitchToolkit, 1800000);

        this.initializeEvents();
        this.initializeCommands();
    }

    /*private connectObs = () => {
        this.obs.connect({ address: 'localhost:4444', password: process.env.OBS_WS_PASS })
            .then(() => {
                console.log('OBS connected');
                // Partner only?
                this.obs.on('SwitchScenes', data => {
                    if(data['scene-name'] === 'Bitte Warten') {
                        tmiOwnerClient.commercial("hannapanda84", 60)
                            .then((data) => {
                                console.log(data);
                            }).catch((err) => {
                            console.log(err);
                        });

                        emitter.emit('tmi.say', `Werbepause! ヾ(ﾟдﾟ)ﾉ`);
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
    }*/

    private initializeEvents = () => {
        var normalizedPath = require("path").join(__dirname, "Events");
        require("fs").readdirSync(normalizedPath).forEach(function(file) {
            try {
                require("./Events/" + file);
            } catch(err) {
                console.log(err);
            }
        });
    }

    private initializeCommands = () => {
        var normalizedPath = require("path").join(__dirname, "Commands");
        require("fs").readdirSync(normalizedPath).forEach(function(file) {
            try {
                require("./Commands/" + file);
            } catch(err) {
                console.log(err);
            }
        });
    }

    private getStreamInfo = async () => {
        const streams = await this.twitchApi.getStreams({ channel: process.env.CHANNEL });

        if(streams && streams.data.length > 0) {
            streamService.currentStream = streams.data[0];
        } else {
            streamService.currentStream = null;
            mongoDBClient.db('flauschipandabot').collection('greeted_users').deleteMany({}, {}, () => {});
        }
    }

    private mentionModSearch = async () => {
        //emitter.emit('tmi.say', 'Ich suche aktuell 1-2 aktive Mods. Mehr Infos im Discord unter https://bit.ly/3HDDuWw');
    }

    private mentionTwitchToolkit = async () => {
        /*if(streamService.currentStream) {
            emitter.emit('tmi.say', '!karmaround Wir spielen mit TwitchToolkit und ihr könnt mitmachen: Befehle und Items unter https://hannapanda.github.io/item-list/');
        }*/
    }

}

let flauschiPandaBot = new FlauschiPandaBot();
