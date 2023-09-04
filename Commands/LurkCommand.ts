import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";
import emoteService from "../Services/EmoteService";
dotenv.config({ path: __dirname+'/../.env' });

class LurkCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'lurk';
    description    = 'Bin dann mal weg';
    answerNoTarget = '###ORIGIN### verschwindet im Flausch 🥰';
    answerTarget   = '';
    globalCooldown = 0;
    customHandler  = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        //sayService.say(origin, context.displayName, '', channel, this.answerNoTarget);
        emitter.emit('playAudio', {file: 'weird_reverse.mp3', mediaType: 'audio', volume: 0.5});

        const response = await openAiClient.getCustomChatGPTResponse(
            `Antworte als niedlicher Panda mit vielen süßen Emotes. Dein Name ist FlauschiPandaBot und deine Mama ist HannaPanda84 (Hanna). Nutze "Ich", um auf dich zu referenzieren.
             Nutze genderneutrale Sprache.
             Nutze ausschließlich folgende Emotes:  
             ${emoteService.getBotTwitchEmotes()}
             ###PRONOMEN###
             ###INFO###
             Beschränke dich auf maximal 60 Wörter für die Nachricht.
             Nutze das Wort "Flausch" für das Wort Lurk. Schreibe dazu eine witzige Nachricht.`,
            `Der User @${context.displayName} verschwindet im Lurk aus folgendem Grund: ${parts.slice(1).join(' ')}`,
            null,
            '',
            false
        );

        sayService.say(origin, context.displayName, '', channel, response);
    };
}

let lurkCommand = new LurkCommand();

export default lurkCommand;