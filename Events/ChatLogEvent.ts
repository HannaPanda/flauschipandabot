import emitter from "../emitter";
import {chatLogService} from "../Services/ChatLogService";

class ChatLogEvent
{
    isActive = true;

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    private handleEvent = async (message, parts, context, origin = 'twitch', channel = null) => {
        if(!this.isActive || !message) {
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
