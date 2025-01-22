import 'reflect-metadata';
import * as net from 'net';

//@ts-ignore
import OBSWebSocket from "obs-websocket-js";

import * as dotenv from "dotenv";
import mongoDBClient from "./Clients/mongoDBClient";
import discordClient from "./Clients/discordClient";
import streamService from "./Services/StreamService";
import obsClient from "./Clients/obsClient";
import wss from "./Clients/wssClient";
import server from "./server";
import twitchClient from "./Clients/twitchClient";
import AbstractOverlayCommand from "./Abstracts/AbstractOverlayCommand";
import AbstractRedeemCommand from "./Abstracts/AbstractRedeemCommand";
import AbstractCommand from "./Abstracts/AbstractCommand";
import { GreetedUserModel } from "./Models/GreetedUser";
import replService from "./Services/ReplService";

dotenv.config({ path: __dirname+'/.env' });
var osProcess = require('process');

interface EnvironmentVariables {
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

declare var process : {
    env: EnvironmentVariables
}

type Command = AbstractCommand | AbstractOverlayCommand | AbstractRedeemCommand;

class FlauschiPandaBot
{
    public obs: OBSWebSocket;
    public twitchClient;
    public wss;

    private commands: Array<Command> = [];

    private server;

    constructor()
    {
        discordClient.eventNames();

        this.obs = obsClient;
        this.twitchClient = twitchClient;
        this.wss = wss;

        setInterval(this.getStreamInfo, 30000);

        this.getStreamInfo();
        this.initializeModules();

        this.server = server;
        this.server.setCommands(this.commands);
        this.server.initializeOverlayCommands();

        this.startReplServer();
    }

    private initializeModules = () => {
        const directories = [
            { path: "Events", addToCommands: false },
            { path: "Commands", addToCommands: true },
            { path: "OverlayCommands", addToCommands: true },
            { path: "RedeemCommands", addToCommands: true },
            { path: "Timers", addToCommands: false }
        ];

        directories.forEach(dir => {
            this.initializeDirectory(dir.path, dir.addToCommands);
        });
    }

    private initializeDirectory = (directory: string, addToCommands: boolean = false) => {
        const normalizedPath = require("path").join(__dirname, directory);
        const self = this;
        require("fs").readdirSync(normalizedPath).forEach(function (file) {
            try {
                const module = require(`./${directory}/${file}`);
                if (addToCommands) {
                    self.commands.push(module);
                }
            } catch (err) {
                console.log(err);
            }
        });
    }

    private getStreamInfo = async () => {
        try {
            const stream = await this.twitchClient.apiClient.streams.getStreamByUserName(process.env.CHANNEL);

            if(stream) {
                streamService.currentStream = stream;
            } else {
                streamService.currentStream = null;
                /*mongoDBClient
                    .db('flauschipandabot')
                    .collection('greeted_users')
                    .deleteMany({}, {}, () => {});*/
                await GreetedUserModel.deleteMany({});

                mongoDBClient
                    .db("flauschipandabot")
                    .collection("fighters")
                    .updateMany({}, {$set: {canUseCommands: true}});
            }
        } catch(err) {
            console.log('Error getting stream info');
        }
    }

    private startReplServer = () => {
        replService.startRepl('flauschipandabot> ');
    }
}

let flauschiPandaBot = new FlauschiPandaBot();
