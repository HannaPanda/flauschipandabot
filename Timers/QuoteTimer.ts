import emitter from "../emitter";
import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";

class QuoteTimer extends AbstractTimer
{
    isActive  = true;
    minutes   = 55;
    chatLines = 5;
    gameName  = "";

    handler = () => {
        sayService.say('twitch', null, '', null, 'Quote of the hour:');
        emitter.emit('chat.message', '!quote', ['!quote'], {username: 'flauschipandabot', 'display-name': 'FlauschiPandaBot', mod: false, owner: false});
    }
}

let quoteTimer = new QuoteTimer();

export default quoteTimer;
