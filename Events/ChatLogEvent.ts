import emitter from "../emitter";
import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import sayService from "../Services/SayService";
import streamService from "../Services/StreamService";
import openAiClient from "../Clients/openAiClient";
import server from "../server";
import obsClient from "../Clients/obsClient";
import {chatLogService} from "../Services/ChatLogService";

dotenv.config({ path: __dirname+'/../.env' });

class ChatLogEvent
{
    isActive = true;

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    private handleEvent = async (message, parts, context, origin = 'tmi', channel = null) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        try {
            await chatLogService.saveChatLog(
                message,
                origin,
                context.userName,
                context.displayName,
                new Date()
            );
        } catch (err) {
            console.error("Failed to save chat log:", err);
        }

        return Promise.resolve(true);
    }
}

let chatLogEvent = new ChatLogEvent();

export default chatLogEvent;