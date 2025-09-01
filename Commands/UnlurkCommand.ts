import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";
import emoteService from "../Services/EmoteService";
import server from "../server";

class UnlurkCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'unlurk';
    description    = 'Bin wieder da';
    answerNoTarget = '###ORIGIN### ist wieder da! emote_hype';
    answerTarget   = '';
    globalCooldown = 0;
    customHandler  = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        server.getIO().emit('playAudio', {file: 'weird.wav', mediaType: 'audio', volume: 0.5});

        const response = await openAiClient.getCustomChatGPTResponse(
            `Antworte als niedlicher Panda mit vielen süßen Emotes. Dein Name ist FlauschiPandaBot und deine Mama ist HannaPanda84 (Hanna). Nutze "Ich", um FlauschiPandaBot referenzieren.
             Nutze genderneutrale Sprache.
             Nutze ausschließlich folgende Emotes:
             ${emoteService.getBotTwitchEmotes()}
             ###PRONOMEN###
             ###INFO###
             Beschränke dich auf maximal 60 Wörter für die Nachricht.
             Nutze das Wort "Flausch" für das Wort Lurk. Schreibe dazu eine witzige Nachricht.`,
            `Der User @${context.displayName} ist zurück aus dem Lurk mit folgender Nachricht: ${parts.slice(1).join(' ')}`,
            null,
            '',
            false
        );

        sayService.say(origin, context.displayName, '', channel, response);
    };
}

let unlurkCommand = new UnlurkCommand();

export default unlurkCommand;
