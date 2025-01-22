import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";
import emoteService from "../Services/EmoteService";

class PizzaCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'pizza';
    description    = 'Spendiere jemandem eine Pizza';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    pizzaSorten = [
        'Salami', 'Speciale', 'Hawaii', 'Thunfisch', 'Spinaci', 'Funghi',
        'Margherita', 'Prosciutto', 'Schinken', 'Vegetarisch', 'Vier Käse'
    ];

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        //const text = `###ORIGIN### spendiert ###TARGET### eine Pizza ${this.pizzaSorten[this.randomInt(0, this.pizzaSorten.length - 1)]}`
        //sayService.say(origin, context.displayName, parts.slice(1).join(' '), channel, text);

        const response = await openAiClient.getCustomChatGPTResponse(
            `Antworte als niedlicher Panda mit vielen süßen Emotes. Dein Name ist FlauschiPandaBot und deine Mama ist HannaPanda84 (Hanna). Nutze "Ich", um FlauschiPandaBot referenzieren.
             Nutze genderneutrale Sprache.
             Nutze ausschließlich folgende Emotes:
             ${emoteService.getBotTwitchEmotes()}
             Schreibe dazu eine witzige Nachricht.`,
            `@${context.displayName} spendiert eine Pizza für ${parts.slice(1).join(' ')}. Bitte wähle eine zufällige Pizza mit zufälligem Belag aus und übergebe sie. Und keine Ananas >:(`,
            null,
            '',
            false
        );

        sayService.say(origin, context.displayName, '', channel, response);

        return Promise.resolve(true);
    }
}

let pizzaCommand = new PizzaCommand();

export default pizzaCommand;
