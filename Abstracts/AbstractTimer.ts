import emitter from "../emitter";
import streamService from "../Services/StreamService";

abstract class AbstractTimer
{
    isActive     = true;
    minutes      = 30;
    chatLines    = 5;
    gameName     = "";

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
        if(streamService.currentStream && this.curChatLines >= this.chatLines && (this.gameName === "" || this.gameName === streamService.currentStream?.game_name)) {
            this.curChatLines = 0;
            this.handler();
        }
    }

    updateChatLines = () => {
        this.curChatLines++;
    }
}

export default AbstractTimer;
