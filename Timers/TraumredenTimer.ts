import emitter from "../emitter";
import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";

class TraumredenTimer extends AbstractTimer
{
    isActive  = true;
    minutes   = 55;
    chatLines = 5;
    gameName  = "";

    handler = () => {
        emitter.emit('chat.message', '!traumreden', ['!traumreden'], {username: 'flauschipandabot', 'display-name': 'FlauschiPandaBot', mod: false, owner: false});
    }
}

let traumredenTimer = new TraumredenTimer();

export default traumredenTimer;
