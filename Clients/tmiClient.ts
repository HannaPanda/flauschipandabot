import {ChatUserstate, Client} from "tmi.js";
import emitter from "../emitter";
import * as dotenv from "dotenv";
import sayService from "../Services/SayService";
import twitchClient from "./twitchClient";

const tmi = require('tmi.js');
dotenv.config({ path: __dirname+'/../.env' });

class Initializer
{
    public tmiClient: Client;
    private bots: Array<string> = ['sery_bot', 'nightbot', 'streamelements', 'audioalerts', 'streamcaptainbot', 'soundalerts'];

    constructor()
    {
        this.tmiClient = new tmi.client({
            identity: {
                username: process.env.BOT_USERNAME,
                password: process.env.BOT_PASS
            },
            channels: [
                process.env.CHANNEL
            ]
        });

        this.tmiClient.on('connected', this.onConnectedHandler);
        this.tmiClient.on('reconnect', this.onReconnectHandler);
        this.tmiClient.on('disconnected', this.onDisconnectedHandler);

        this.tmiClient.on('message', this.onMessageHandler);
        this.tmiClient.on('raided', this.onRaidedHandler);
        this.tmiClient.on('redeem', this.onRedeemHandler)

        this.tmiClient.connect();
    }

    private onConnectedHandler = (addr: string, port: number) => {
        console.info(`* Connected to ${addr}:${port}`);
    }

    private onReconnectHandler = () => {
        console.info(`* Reconnected`);
    }

    private onDisconnectedHandler = (reason: string) => {
        console.warn(`* Disconnected: ${reason}`);
    }

    private onMessageHandler = async (target: string, context: ChatUserstate, message: string, self: boolean) => {
        if (self || this.bots.includes(context.username)) {
            return;
        }

        context.owner = (context.username === process.env.CHANNEL);
        context.vip = (context?.badges?.vip === '1');

        emitter.emit('chat.message', message, message.split(' '), context);
    }

    private onRaidedHandler = (channel: string, username: string, viewers: number) => {
        sayService.say('tmi', '', '', null, `Vielen Dank für den Raid ${username} ヽ(゜∇゜)ノ`)
        sayService.say('tmi', '', '', null, `Hey ihr Flauschis, schaut doch mal bei ${username} rein! https://twitch.tv/${username}`)
        sayService.say('tmi', '', '', null, `/shoutout ${username}`);
        //twitchClient.shoutout()
        emitter.emit('playAudio', {file: 'skibidi.mp3', mediaType: 'audio', volume: 0.25});
        emitter.emit('bot.say', 'Willkommen im beklopptesten Stream auf Twitch ihr flauschigen Raider!');
    };

    private onRedeemHandler = (channel: string, username: string, rewardType: 'highlighted-message' | 'skip-subs-mode-message' | string, tags: ChatUserstate) => {
        /*console.log("######################");
        console.log(username, rewardType, tags, channel);
        console.log("######################");*/
    }
}

let initializer = new Initializer();

export default initializer.tmiClient;