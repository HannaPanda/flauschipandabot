import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";

class TwitchtoolkitTimer extends AbstractTimer
{
    isActive  = true;
    minutes   = 35;
    chatLines = 5;
    gameName  = 'RimWorld';

    handler = () => {
        const text = '!karmaround Wir spielen mit TwitchToolkit und ihr könnt mitmachen: Befehle und Items unter https://hannapanda.github.io/item-list/';
        sayService.say('twitch', '', '', null, text);
    }
}

let twitchtoolkitTimer = new TwitchtoolkitTimer();

export default twitchtoolkitTimer;
