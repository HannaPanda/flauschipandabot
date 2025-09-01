import sayService from "../Services/SayService";
import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";

class VipRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "VIP (Very Important Panda)";
    handler  = (message) => {
        const hype = 'emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype ' +
            'emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype ' +
            'emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype emote_hype ' +
            'emote_hype emote_hype emote_hype emote_hype emote_hype';
        server.getIO().emit('playAudio', {file: 'secret1.wav', mediaType: 'audio', volume: 0.5});
        sayService.say('twitch', '', '', null, hype);
        sayService.say('twitch', '', '', null, hype);
    };
}

const vipRedeemCommand = new VipRedeemCommand();

export default vipRedeemCommand;
