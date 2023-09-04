import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import knochenCommand from "./KnochenCommand";
import Fighter from "../Models/Fighter";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";
import emoteService from "../Services/EmoteService";
dotenv.config({ path: __dirname+'/../.env' });

class EssenCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'essen';
    description    = 'Lass FlauschiPandaBot jemandem etwas leckeres kochen';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const response = await openAiClient.getCustomChatGPTResponse(
            `Antworte als niedlicher Panda mit vielen süßen Emotes. Dein Name ist FlauschiPandaBot und deine Mama ist HannaPanda84 (Hanna). Nutze "Ich", um FlauschiPandaBot referenzieren.
             Nutze genderneutrale Sprache.
             Nutze ausschließlich folgende Emotes:  
             ${emoteService.getBotTwitchEmotes()}
             Nutze das Wort "Flausch" für das Wort Lurk. Schreibe dazu eine witzige Nachricht.`,
            `@${context.displayName} möchte dass du für ${parts.slice(1).join(' ')} etwas leckeres kochst.`,
            null,
            '',
            false
        );

        sayService.say(origin, context.displayName, '', channel, response);

        return Promise.resolve(true);
    }
}

let essenCommand = new EssenCommand();

export default essenCommand;