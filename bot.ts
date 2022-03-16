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

        this.obs = new OBSWebSocket();
        this.obs.connect({ address: 'localhost:4444', password: process.env.OBS_WS_PASS })
            .then(() => {
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
            })
            .catch((err) => {
                console.warn(err);
            });

        setInterval(this.getStreamInfo, 30000);
        setInterval(this.mentionModSearch, 3600000*3);
        setInterval(this.mentionTwitchToolkit, 1800000);

        this.initializeEvents();
        this.initializeCommands();
    }

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
        if(streamService.currentStream) {
            emitter.emit('tmi.say', 'Wir spielen mit TwitchToolkit und ihr könnt mitmachen: Befehle und Items unter https://sourcedog.github.io/item-list/');
            emitter.emit('tmi.say', '!karmaround');
        }
    }

}

let flauschiPandaBot = new FlauschiPandaBot();
