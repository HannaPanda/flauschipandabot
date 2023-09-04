import TwitchApi from "node-twitch";
//@ts-ignore
import OBSWebSocket from "obs-websocket-js";

import * as dotenv from "dotenv";
import mongoDBClient from "./Clients/mongoDBClient";
import discordClient from "./Clients/discordClient";
import streamService from "./Services/StreamService";
import obsClient from "./Clients/obsClient";
import wss from "./Clients/wssClient";
import { PubSubClient } from '@twurple/pubsub';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import * as fs from 'fs';
import emitter from "./emitter";
import server from "./server";
import twitchClient from "./Clients/twitchClient";

dotenv.config({ path: __dirname+'/.env' });
var osProcess = require('process');

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
        DISCORD_GUILD_ID: string,
        EVENTSUB_SECRET: string
    }
}

class FlauschiPandaBot
{
    public obs: OBSWebSocket;
    public twitchClient;
    public wss;

    private commands: Array<any> = [];

    private server;

    constructor()
    {
        discordClient.eventNames();

        this.obs = obsClient;
        this.twitchClient = twitchClient;
        this.wss = wss;

        setInterval(this.getStreamInfo, 30000);
        /*setInterval(() => {
            const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

            const memoryData = osProcess.memoryUsage();

            const memoryUsage = {
                rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
                heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
                heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
                external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
            };

            console.log(memoryUsage);

        }, 30000);*/

        this.getStreamInfo();
        this.initializeEvents();
        this.initializeCommands();
        this.initializeOverlayCommands();
        this.initializeRedeemCommands();
        this.initializeTimers();

        this.server = server;
        this.server.setCommands(this.commands);
        this.server.initializeOverlayCommands();
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
        const self = this;
        require("fs").readdirSync(normalizedPath).forEach(function (file) {
            try {
                self.commands.push(require("./Commands/" + file));
            } catch (err) {
                console.log(err);
            }
        });
    }

    private initializeOverlayCommands = () => {
        var normalizedPath = require("path").join(__dirname, "OverlayCommands");
        const self = this;
        require("fs").readdirSync(normalizedPath).forEach(function(file) {
            try {
                self.commands.push(require("./OverlayCommands/" + file));
            } catch(err) {
                console.log(err);
            }
        });
    }

    private initializeRedeemCommands = () => {
        var normalizedPath = require("path").join(__dirname, "RedeemCommands");
        const self = this;
        require("fs").readdirSync(normalizedPath).forEach(function(file) {
            try {
                self.commands.push(require("./RedeemCommands/" + file));
            } catch(err) {
                console.log(err);
            }
        });
    }

    private initializeTimers = () => {
        var normalizedPath = require("path").join(__dirname, "Timers");
        const self = this;
        require("fs").readdirSync(normalizedPath).forEach(function(file) {
            try {
                require("./Timers/" + file);
            } catch(err) {
                console.log(err);
            }
        });
    }

    private getStreamInfo = async () => {
        try {
            const streams = await this.twitchClient.twitchApi.getStreams({ channel: process.env.CHANNEL });

            if(streams && streams.data.length > 0) {
                streamService.currentStream = streams.data[0];
            } else {
                streamService.currentStream = null;
                mongoDBClient
                    .db('flauschipandabot')
                    .collection('greeted_users')
                    .deleteMany({}, {}, () => {});

                mongoDBClient
                    .db("flauschipandabot")
                    .collection("fighters")
                    .updateMany({}, {$set: {canUseCommands: true}});
            }
        } catch(err) {
            console.log('Error getting stream info');
        }
    }

}

let flauschiPandaBot = new FlauschiPandaBot();
