import emitter from "../emitter";
import tmiClient from "../Clients/tmiClient";
import * as dotenv from "dotenv";
import discordClient from "../Clients/discordClient";
dotenv.config({ path: __dirname+'/../.env' });

class SayEvent
{
    isActive = true;

    constructor()
    {
        emitter.on('tmi.say', this.handleTwitchEvent);
        emitter.on('discord.say', this.handleDiscordEvent);
    }

    private handleTwitchEvent = async (message) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        return tmiClient.say(process.env.CHANNEL, message).catch((err) => {console.warn(err)});
    }

    private handleDiscordEvent = async (message, channel) => {
        if(!this.isActive || !channel) {
            return Promise.resolve(false);
        }

        channel.send(message).catch((err) => {console.warn(err)});
    }
}

let sayEvent = new SayEvent();

export default sayEvent;