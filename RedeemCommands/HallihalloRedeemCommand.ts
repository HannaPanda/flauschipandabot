import emitter from "../emitter";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
import Fighter from "../Models/Fighter";
import moment from "moment";
import sayService from "../Services/SayService";
import mongoDBClient from "../Clients/mongoDBClient";
import botService from "../Services/BotService";
import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";
dotenv.config({ path: __dirname+'/../.env' });

class HallihalloRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Hallihallo!";
    handler  = (message) => {
        server.getIO().emit('showImage', {file: 'hallihallo.png', mediaType: 'image', duration: 5000});
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const hallihalloRedeemCommand = new HallihalloRedeemCommand();

export default hallihalloRedeemCommand;