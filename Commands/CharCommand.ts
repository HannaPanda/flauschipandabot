import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";

class CharCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'char';
    description    = 'Frag einen bestimmten Charakter etwas';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    characters = {
        'böseoma': 'Antworte als grantige, wütende alte Oma.',
        'liebeoma': 'Antworte als super liebe, freundliche alte Oma.',
        '8ball': 'Antworte als magischer 8 Ball. Sei mystisch und geheimnisvoll.',
        'flirty': 'Antworte auf flirtende Art und Weise mit viel Zweideutigkeit.',
        'neko': 'Antworte süß im Stil eines Nekos mit vielen süßen Emotes.',
        'nerd': 'Antworte als totaler Nerd.',
        'drunk': 'Antworte, als seist du komplett und heftig betrunken. Sprich undeutlich.',
        'baby': 'Antworte als seist du ein Baby, das gerade Sprechen lernt.',
        'krankenschwester': 'Antworte, als seist du eine super fürsorgliche Panda-Krankenschwester.',
    };

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        console.log('test');
        let username = (origin === 'tmi') ? context.displayName : context.userName;

        if(parts.length === 1) {
            sayService.say(origin, context.displayName, '', channel, `Folgende Charaktere stehen zur Auswahl: ${Object.keys(this.characters).join(', ')}. Aufruf mit !char CHARAKTERNAME TEXT`);
        } else if(this.characters.hasOwnProperty(parts[1])) {

            let testParts = parts.slice();
            testParts.splice(0, 2);
            const request = testParts.join(' ');

            const response = await openAiClient.getCustomChatGPTResponse(
                `${this.characters[parts[1]]} Nutze genderneutrale Sprache. Deine Antworten sind immer Deutsch. Beginne die Antwort mit @${username}.`,
                `Frage von "@${username}": ${request}`,
                parts[1],
                username
            );

            sayService.say(origin, context.displayName, '', channel, response);
        }
    };
}

let charCommand = new CharCommand();

export default charCommand;
