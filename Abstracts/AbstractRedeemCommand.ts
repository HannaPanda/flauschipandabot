import emitter from "../emitter";
import * as dotenv from "dotenv";
import { PubSubRedemptionMessage } from "@twurple/pubsub";
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

    private internalHandler = (message: PubSubRedemptionMessage) => {
        if(this.isActive && this.handler && message.rewardTitle === this.command) {
            this.handler(message);
        }
    }
}

export default AbstractRedeemCommand;
