import emitter from "../emitter";
import * as dotenv from "dotenv";
import streamService from "../Services/StreamService";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";
import server from "../server";
import {GreetedUserModel} from "../Models/GreetedUser";
import UserModel from "../Models/User";
dotenv.config({ path: __dirname+'/../.env' });

class GreetEvent
{
    isActive = true;

    private streamers: Array<string> = ['misakidestiny', 'murmelmaus_gina', 'teelinchen', 'eulinchen82', 'artimus83', 'serapinlp'];

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    private handleEvent = async (message, parts, context, origin = 'tmi', channel = null) => {
        if (!this.isActive || origin === 'discord') {
            return Promise.resolve(false);
        }

        if (!context.userName || context.owner || context.userName === 'flauschipandabot') {
            return Promise.resolve(false);
        }

        if (!streamService.currentStream) {
            return Promise.resolve(false);
        }

        let greetedUser = await GreetedUserModel.findOne({ username: context.userName });

        if (greetedUser) {
            return Promise.resolve(false);
        }

        await new GreetedUserModel({ username: context.userName }).save();

        switch (context.userName) {
            case 'killerpretzel':
                emitter.emit('chat.message', '!brezel', ['!brezel'], { username: '', 'display-name': '', mod: false, owner: false });
                break;
            case 'vipera_ivanesca':
                sayService.say(origin, context.displayName, '', channel, `Sei willkommen Maja!`);
                break;
            case 'lormos':
                server.getIO().emit('playAudio', { file: 'feueball.mp3', mediaType: 'audio', volume: 0.5 });
                sayService.say(origin, context.displayName, '', channel, `/me überschüttet ###ORIGIN### zur Begrüßung mit einem Haufen flauschiger Herzen emote_heart emote_heart emote_heart`);
                break;
            case 'yoshi_das_flohfell':
                server.getIO().emit('playAudio', { file: 'fluffy.mp3', mediaType: 'audio', volume: 0.5 });
                sayService.say(origin, context.displayName, '', channel, `/me schaut doch mal bei http://TheSoftPlanet.etsy.com vorbei. So süße Flauschis emote_heart emote_heart emote_heart`);
                break;
            default:
                server.getIO().emit('playAudio', { file: 'hello.mp3', mediaType: 'audio', volume: 0.5 });
        }

        if (this.streamers.indexOf(context.userName) !== -1) {
            const text = `Schaut doch mal bei ###ORIGIN### vorbei: https://twitch.tv/${context.userName} emote_hype`;
            sayService.say(origin, context.displayName, '', channel, text);
        }

        let user = await UserModel.findOne({ username: context.userName });

        let response;

        if (!user) {
            response = await openAiClient.getChatGPTResponse(`
                Bitte begrüße den User ${context.displayName} ganz lieb zu Hanna's Stream.
                Nutze genderneutrale Sprache.
                Behandle die Person als sei sie komplett neu im Stream.`, '', true, '60');

            await new UserModel({ username: context.userName }).save();
        } else {
            const pronomenText = (user?.pronomen) ? `Die Pronomen der Person sind '${user?.pronomen}'` : 'Nutze genderneutrale Sprache.';

            response = await openAiClient.getChatGPTResponse(`
            Bitte begrüße den User ${context.displayName} ganz lieb zu Hanna's Stream.
            ${pronomenText}
            Behandle die Person wie einen bereits Bekannten Menschen.`, '', true, '60');
        }

        await openAiClient.botSay(response);
        sayService.say(origin, context.displayName, '', channel, response);

        return Promise.resolve(true);
    };
}

let greetEvent = new GreetEvent();

export default greetEvent;
