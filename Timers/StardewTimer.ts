import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";

class StardewTimer extends AbstractTimer
{
    isActive  = true;
    minutes   = 27;
    chatLines = 5;
    gameName  = 'Stardew Valley';

    handler = () => {
        const text = 'Ihr könnt 19Moon82 und mir gleichzeitig zuschauen: https://multistre.am/19moon82/hannapanda84/layout4/';
        sayService.say('tmi', '', '', null, text);
    }
}

let stardewTimer = new StardewTimer();

export default stardewTimer;
