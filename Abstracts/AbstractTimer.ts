import emitter from "../emitter";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import Fighter from "../Models/Fighter";
import streamService from "../Services/StreamService";
dotenv.config({ path: __dirname+'/../.env' });

abstract class AbstractTimer
{
    isActive     = true;
    minutes      = 30;
    chatLines    = 5;

    curChatLines = 0;

    handler      = null;

    constructor()
    {
        setTimeout(this.init, 1000);
        emitter.on('chat.message', this.updateChatLines);
    }

    init = () => {
        if(this.isActive && this.handler) {
            setInterval(this.internalHandler, this.minutes * 60 * 1000);
        }
    }

    internalHandler = () => {
        if(streamService.currentStream && this.curChatLines >= this.chatLines) {
            this.curChatLines = 0;
            this.handler();
        }
    }

    updateChatLines = () => {
        this.curChatLines++;
    }
}

export default AbstractTimer;