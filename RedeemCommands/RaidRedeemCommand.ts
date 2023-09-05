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

class RaidRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Raid-Anführer";
    handler  = (message) => {
        server.getIO().emit('showImage', {file: 'raid_anfuehrer.png', mediaType: 'image', duration: 5000});
        server.getIO().emit('playAudio', {file: 'getNewSpecialItem.wav', mediaType: 'audio', volume: 0.5});
    };
}

const raidRedeemCommand = new RaidRedeemCommand();

export default raidRedeemCommand;