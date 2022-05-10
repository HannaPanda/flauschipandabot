import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import knochenCommand from "./KnochenCommand";
import Fighter from "../Models/Fighter";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

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
        const text = `###ORIGIN### spendiert ###TARGET### eine Pizza ${this.pizzaSorten[this.randomInt(0, this.pizzaSorten.length - 1)]}`
        sayService.say(origin, context['display-name'], parts.slice(1).join(' '), channel, text);

        return Promise.resolve(true);
    }
}

let pizzaCommand = new PizzaCommand();

export default pizzaCommand;