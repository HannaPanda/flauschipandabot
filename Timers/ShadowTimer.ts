import AbstractTimer from "../Abstracts/AbstractTimer";
import sayService from "../Services/SayService";

class ShadowTimer extends AbstractTimer
{
    isActive  = false;
    minutes   = 125;
    chatLines = 5;

    handler = () => {
        const text1 = `Shadow ist ein PC in der Cloud. Für 29,99€ (44,98€ für Power Upgrade, wenn verfügbar) könnt ihr, schnelles Internet vorrausgesetzt, einen Windows 10 PC in der Cloud für Gaming nutzen: https://shop.shadow.tech/pre-order/invite/668FCAE`;
        sayService.say('tmi', '', '', null, text1);
    }
}

let shadowTimer = new ShadowTimer();

export default shadowTimer;
