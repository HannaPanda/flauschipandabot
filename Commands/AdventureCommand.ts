import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";

/**
 * Command to manage an interactive narrative game with memory management.
 * This command sends the user's narrative input to the Game Master (GM)
 * via the OpenAI API, which returns a narrative response and a compressed memory chunk.
 * The narrative is then sent to the chat, and the memory chunk is stored in the database.
 */
class AdventureCommand extends AbstractCommand {
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'adventure';
    description    = 'Manages an interactive narrative game with memory handling.';
    globalCooldown = 0;

    /**
     * Custom handler for the adventure command.
     * It retrieves the user's narrative input, calls the OpenAI API to get the GM response,
     * and sends the narrative to the chat while storing the memory chunk in the database.
     *
     * @param {string} message - The raw message text.
     * @param {string[]} parts - The command parts split by space.
     * @param {any} context - The context of the message (e.g., user information).
     * @param {string} [origin='twitch'] - The origin of the message.
     * @param {string|null} [channel=null] - The channel identifier.
     * @param {any} [messageObject=null] - Additional message object data.
     */
    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        const channelId = channel || context.channel;
        const username = (origin === 'twitch') ? context.displayName : context.userName;
        if (parts.length < 2) {
            sayService.say(origin, context.displayName, '', channel, `Usage: !adventure <your narrative>`);
            return;
        }
        const userInput = parts.slice(1).join(' ');
        try {
            // Set allowed tokens for the conversation context (e.g., 16000 tokens)
            const allowedTokens = 16000;
            const { gmResponse } = await openAiClient.getStoryGameResponse(userInput, channelId, allowedTokens);
            // Send the GM narrative to the chat
            sayService.say(origin, context.displayName, '', channel, gmResponse);
        } catch (err) {
            console.error('Error in AdventureCommand:', err);
            sayService.say(origin, context.displayName, '', channel, 'Sorry, something went wrong with the adventure.');
        }
    };
}

const adventureCommand = new AdventureCommand();
export default adventureCommand;
