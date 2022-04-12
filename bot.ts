import TwitchApi from "node-twitch";
//@ts-ignore
import OBSWebSocket from "obs-websocket-js";

import * as dotenv from "dotenv";
import mongoDBClient from "./Clients/mongoDBClient";
import discordClient from "./Clients/discordClient";
import streamService from "./Services/StreamService";
import obsClient from "./Clients/obsClient";
import { ApiClient } from 'twitch';
import { ClientCredentialsAuthProvider } from 'twitch-auth';
import {PubSubClient, PubSubRedemptionMessage} from 'twitch-pubsub-client';

dotenv.config({ path: __dirname+'/.env' });

const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./Templates');
let twing = new TwingEnvironment(loader);

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
    private commands: Array<any> = [];

    constructor()
    {
        const self = this;

        discordClient.eventNames();

        this.twitchApi = new TwitchApi({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            scopes: ["channel:edit:commercial", "moderation:read"]
        });

        this.obs = obsClient;

        setInterval(this.getStreamInfo, 30000);
        setInterval(this.mentionModSearch, 3600000*3);
        setInterval(this.mentionTwitchToolkit, 1800000);

        this.getStreamInfo();
        this.initializeEvents();
        this.initializeCommands();
        this.initializeTimers();

        const express = require('express');
        const app = express();
        const port = 3000;

        app.use('/static', express.static('public'));

        app.get('/', function (req, res) {
            twing.render('index.twig', {activePage: 'home'}).then((output) => {
                res.end(output);
            });
        });

        app.get('/commands', function (req, res) {
            twing.render('commands.twig', {'commands': self.commands, activePage: 'commands'}).then((output) => {
                res.end(output);
            });
        });

        app.get('/quotes', async (req, res) => {
            let quotes = await mongoDBClient
                .db("flauschipandabot")
                .collection("quotes")
                .find()
                .toArray();
            twing.render('quotes.twig', {'quotes': quotes, activePage: 'quotes'}).then((output) => {
                res.end(output);
            });
        });

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        });

        this.initializeRedeemEvent();
    }

    private initializeRedeemEvent = async () => {
        // TODO: needs OAuth Flow
        /*const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
        const apiClient = new ApiClient({ authProvider });

        const pubSubClient = new PubSubClient();
        const userId = await pubSubClient.registerUserListener(apiClient);
        const listener = await pubSubClient.onRedemption(userId, (message: PubSubRedemptionMessage) => {
            console.log(`${message.userDisplayName} hat gerade etwas eingelöst!`);
        });*/
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
        require("fs").readdirSync(normalizedPath).forEach(function(file) {
            try {
                self.commands.push(require("./Commands/" + file));
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
        /*const test = await this.twitchApi.getUsers(['hannapanda84']);
        console.log(test);*/

        /*const fnöt = await this.twitchApi.getModerators({broadcaster_id: '30681765'});
        console.log(fnöt);*/

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
