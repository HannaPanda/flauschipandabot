import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class QuoteTimer extends AbstractTimer
{
    isActive  = true;
    minutes   = 55;
    chatLines = 5;
    gameName  = "";

    handler = () => {
        sayService.say('tmi', null, '', null, 'Quote of the hour:');
        emitter.emit('chat.message', '!quote', ['!quote'], {username: '', 'display-name': '', mod: false, owner: false});
    }
}

let quoteTimer = new QuoteTimer();

export default quoteTimer;