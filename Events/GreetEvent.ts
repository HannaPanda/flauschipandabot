import emitter from "../emitter";
import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import streamService from "../Services/StreamService";
dotenv.config({ path: __dirname+'/../.env' });

class GreetEvent
{
    isActive = true;

    private streamers: Array<string> = ['misakidestiny', 'murmelmaus_gina', 'teelinchen', 'eulinchen82', 'artimus83'];

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    private handleEvent = async (message, parts, context, origin = 'tmi', channel = null) => {
        if(!this.isActive || origin === 'discord') {
            return Promise.resolve(false);
        }

        if(!context.username || context.username === process.env.CHANNEL || context.username === 'flauschipandabot') {
            return Promise.resolve(false);
        }

        if(!streamService.currentStream) {
            return Promise.resolve(false);
        }

        let user = await mongoDBClient
            .db("flauschipandabot")
            .collection("greeted_users")
            .findOne({name: context.username}, {});

        if(user) {
            return Promise.resolve(false);
        }

        await mongoDBClient
            .db("flauschipandabot")
            .collection("greeted_users")
            .insertOne({name: context.username});

        emitter.emit(`${origin}.say`, `/me flauscht ${context['display-name']} zur Begrüßung richtig durch ${emoteService.getEmote(origin, 'greet')}`);

        if(this.streamers.indexOf(context.username) !== -1) {
            emitter.emit(
                `${origin}.say`,
                `Schaut doch mal bei ${context['display-name']} vorbei: https://twitch.tv/${context.username.toLowerCase()} ${emoteService.getEmote(origin, 'hype')}`
            );
        }

        return Promise.resolve(true);
    }
}

let greetEvent = new GreetEvent();

export default greetEvent;