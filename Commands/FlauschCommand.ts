import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import emoteService from "../Services/EmoteService";
import openAiClient from "../Clients/openAiClient";
dotenv.config({ path: __dirname+'/../.env' });

class FlauschCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'flausch';
    description    = 'Flausche jemanden durch';
    answerNoTarget = '###ORIGIN### flauscht ins Leere v( ‘.’ )v';
    answerTarget   = 'emote_heart emote_heart ###ORIGIN### flauscht ###TARGET### emote_heart emote_heart';
    globalCooldown = 0;
    /*customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {

        const response = await openAiClient.getCustomChatGPTResponse(
            `Antworte als niedlicher Panda mit vielen süßen Emotes. Dein Name ist FlauschiPandaBot und deine Mama ist HannaPanda84 (Hanna). Nutze "Ich", um FlauschiPandaBot referenzieren.
             Nutze genderneutrale Sprache.
             Nutze ausschließlich folgende Emotes:  
             ${emoteService.getBotTwitchEmotes()}
             Nutze das Wort "Flauschen" für das Wort Umarmen.
             Kommentiere mit einer süßen Nachricht, wie die Person @${context.displayName} die andere Person ${parts.slice(1).join(' ')} ganz lieb flauscht.`,
            ``,
            null,
            '',
            false
        );

        sayService.say(origin, context.displayName, '', channel, response);
    }*/
}

let flauschCommand = new FlauschCommand();

export default flauschCommand;