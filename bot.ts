import TwitchApi from "node-twitch";
//@ts-ignore
import OBSWebSocket from "obs-websocket-js";

import * as dotenv from "dotenv";
import mongoDBClient from "./Clients/mongoDBClient";
import discordClient from "./Clients/discordClient";
import streamService from "./Services/StreamService";
import obsClient from "./Clients/obsClient";
import { PubSubClient } from '@twurple/pubsub';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import * as fs from 'fs';
import emitter from "./emitter";
import server from "./server";
import twitchClient from "./Clients/twitchClient";

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
    public twitchClient;

    private commands: Array<any> = [];

    private server;

    constructor()
    {
        discordClient.eventNames();

        this.twitchApi = new TwitchApi({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            scopes: ["channel:edit:commercial", "moderation:read"]
        });

        this.obs = obsClient;
        this.twitchClient = twitchClient;

        setInterval(this.getStreamInfo, 30000);

        this.getStreamInfo();
        this.initializeEvents();
        this.initializeCommands();
        this.initializeOverlayCommands();
        this.initializeRedeemCommands();
        this.initializeTimers();

        this.server = server;
        this.server.setCommands(this.commands);
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
            const streams = await this.twitchApi.getStreams({ channel: process.env.CHANNEL });

            /*const test = await twitchClient.apiClient?.streams.getStreams({ userName: process.env.CHANNEL });
             console.log(test);*/

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
            console.log('abgesoffen');
        }
    }

}

let flauschiPandaBot = new FlauschiPandaBot();
