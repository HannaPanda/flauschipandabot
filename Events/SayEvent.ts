import emitter from "../emitter";
import twitchClient from "../Clients/twitchClient";
import { Env } from "../Config/Environment";

class SayEvent
{
    isActive = true;

    constructor()
    {
        emitter.on('twitch.say', this.handleTwitchEvent);
        emitter.on('discord.say', this.handleDiscordEvent);
    }

    private handleTwitchEvent = async (message) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        return twitchClient.chatClient.say(Env.channel, message).catch((err) => {console.warn(err)});
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
