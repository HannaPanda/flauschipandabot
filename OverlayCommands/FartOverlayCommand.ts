import AbstractOverlayCommand from "../Abstracts/AbstractOverlayCommand";
import server from "../server";

class FartOverlayCommand extends AbstractOverlayCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "fart";
    aliases        = [];
    description    = "Pupsi";
    mediaFile      = "fart1.mp3";
    mediaType      = "audio";
    volume         = 0.5;
    customHandler  = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const sounds = ['fart1.mp3', 'fart2.mp3', 'fart3.mp3', 'fart4.mp3',];


        let numberOfPlays = 1;
        let maxNumberOfPlays = 10;
        let delay = 500;
        let minDelay = 100;
        const numberPattern = /\d+/g;

        const firstNumber = parts[1]?.match(numberPattern) ?? '1';
        numberOfPlays = Math.min(maxNumberOfPlays, (firstNumber !== '' && parseInt(firstNumber) > 0) ? parseInt(firstNumber) : 1);

        const secondNumber = parts[2]?.match(numberPattern) ?? '500';
        delay = Math.max(minDelay, Math.min(1000, (secondNumber !== '' && parseInt(secondNumber) > 0) ? parseInt(secondNumber) : 500));

        for(let i = 0; i < numberOfPlays; i++) {
            await this.delay(delay);
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            server.getIO().emit('playAudio', {file: randomSound, mediaType: 'audio', volume: this.volume});
        }
    };

    delay = async (ms: number) => {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}

let fartOverlayCommand = new FartOverlayCommand();

export default fartOverlayCommand;
