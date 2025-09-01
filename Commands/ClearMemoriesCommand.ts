import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import { MemoryModel } from "../Models/Memory";

/**
 * Command to clear all stored memories for the current channel.
 * This command deletes all memory entries from the database for the channel
 * where it was issued. Only moderators or higher should be allowed to use this command.
 */
class ClearMemoriesCommand extends AbstractCommand {
    isActive       = true;
    isModOnly      = true; // Only mods (or higher) can use this command
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'clearmemories';
    description    = 'Clears all stored memories for the current channel.';
    globalCooldown = 0;

    /**
     * Custom handler for the clear memories command.
     * Deletes all memory entries in MongoDB for the given channel.
     *
     * @param {string} message - The raw message text.
     * @param {string[]} parts - The command parts split by space.
     * @param {any} context - The context of the message (e.g., user information).
     * @param {string} [origin='twitch'] - The origin of the message.
     * @param {string|null} [channel=null] - The channel identifier.
     * @param {any} [messageObject=null] - Additional message object data.
     */
    customHandler = async (message: string, parts: string[], context: any, origin = 'twitch', channel: string | null = null, messageObject: any = null) => {
        const channelId = channel || context.channel;
        try {
            await MemoryModel.deleteMany({ channel: channelId }).exec();
            sayService.say(origin, context.displayName, '', channel, `Alle Memories für diesen Channel wurden gelöscht.`);
        } catch (err) {
            console.error('Error in ClearMemoriesCommand:', err);
            sayService.say(origin, context.displayName, '', channel, 'Beim Löschen der Memories ist ein Fehler aufgetreten.');
        }
    };
}

const clearMemoriesCommand = new ClearMemoriesCommand();
export default clearMemoriesCommand;
