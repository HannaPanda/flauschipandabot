import emitter from "../emitter";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import Fighter from "../Models/Fighter";
import moment from "moment";
import sayService from "../Services/SayService";
import mongoDBClient from "../Clients/mongoDBClient";
import botService from "../Services/BotService";
dotenv.config({ path: __dirname+'/../.env' });

abstract class AbstractRedeemCommand
{
    isActive = true;
    command  = "";
    handler  = null;

    constructor()
    {
        emitter.on('chat.redeem', this.internalHandler);
    }

    private internalHandler = (message) => {
        if(this.isActive && this.handler && message.rewardTitle === this.command) {
            this.handler(message);
        }
    }
}

export default AbstractRedeemCommand;