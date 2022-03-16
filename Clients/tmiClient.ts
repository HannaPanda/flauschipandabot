import {ChatUserstate, Client} from "tmi.js";
import emitter from "../emitter";
import * as dotenv from "dotenv";

const tmi = require('tmi.js');
dotenv.config({ path: __dirname+'/../.env' });

class Initializer
{
    public tmiClient: Client;

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
        if (self || context.username === 'nightbot'|| context.username === 'streamelements') {
            return;
        }

        emitter.emit('chat.message', message, message.split(' '), context);
    }

    private onRaidedHandler = (channel: string, username: string, viewers: number) => {
        emitter.emit('tmi.say', `Vielen Dank für den Raid ${username} ヽ(゜∇゜)ノ`);
        emitter.emit('tmi.say', `Hey ihr Flauschis, schaut doch mal bei ${username} rein! https://twitch.tv/${username}`);
    }
}

let initializer = new Initializer();

export default initializer.tmiClient;