import emitter from "../emitter";
import { PubSubRedemptionMessage } from "@twurple/pubsub";

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
