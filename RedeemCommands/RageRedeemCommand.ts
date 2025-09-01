import sayService from "../Services/SayService";
import AbstractRedeemCommand from "../Abstracts/AbstractRedeemCommand";
import server from "../server";

class RageRedeemCommand extends AbstractRedeemCommand
{
    isActive = true;
    command  = "Rage Game im nächsten Stream";
    handler  = (message) => {
        const hype = 'emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry ' +
            'emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry ' +
            'emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry emote_angry ' +
            'emote_angry emote_angry emote_angry emote_angry emote_angry';
        server.getIO().emit('playAudio', {file: 'fuuu.mp3', mediaType: 'audio', volume: 0.1});
        sayService.say('twitch', '', '', null, hype);
        sayService.say('twitch', '', '', null, hype);
    };
}

const rageRedeemCommand = new RageRedeemCommand();

export default rageRedeemCommand;
