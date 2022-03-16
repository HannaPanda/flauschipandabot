import {ChatUserstate, Client} from "tmi.js";
import emitter from "../emitter";
import * as dotenv from "dotenv";

const tmi = require('tmi.js');
dotenv.config({ path: __dirname+'/../.env' });

class Initializer
{
    public tmiOwnerClient: Client;

    constructor()
    {
        this.tmiOwnerClient = new tmi.client({
            identity: {
                username: process.env.OWNER_USERNAME,
                password: process.env.OWNER_PASS
            },
            channels: [
                process.env.CHANNEL
            ]
        });

        this.tmiOwnerClient.on('connected', this.onConnectedHandler);
        this.tmiOwnerClient.on('reconnect', this.onReconnectHandler);
        this.tmiOwnerClient.on('disconnected', this.onDisconnectedHandler);

        this.tmiOwnerClient.connect();
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
}

let initializer = new Initializer();

export default initializer.tmiOwnerClient;