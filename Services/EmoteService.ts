import * as dotenv from "dotenv";
import discordClient from "../Clients/discordClient";
dotenv.config({ path: __dirname+'/../.env' });

class EmoteService
{
    discordEmotes = {
        'hype': 'hype112',
        'greet': 'wave~1',
        'heart': 'Heart112',
        'angry': 'angry~1',
        'stinky': 'skunk',
        'bleed': 'cloud_rain',
        'unity': 'hannap5Heart',
        'woah': 'Woah112',
        'sleep': 'zzz~1',
        'rave': 'hannap5Rave'
    };

    twitchEmotes = {
        'hype': 'hannap5Hype',
        'greet': 'hannap5Wave',
        'heart': 'hannap5Heart',
        'angry': 'hannap5Angry',
        'stinky': 'StinkyCheese',
        'bleed': 'bleedPurple',
        'unity': 'TwitchUnity',
        'woah': 'hannap5PandaWoah',
        'sleep': 'hannap5Sleep',
        'rave': 'hannap5Rave'
    };

    getEmote = (origin: string, emote: string) => {
        emote = emote.replace('emote_', '');

        if(origin === 'discord' && emote in this.discordEmotes) {
            return discordClient.emojis.cache.find(emoji => emoji.name === this.discordEmotes[emote]) ?? this.discordEmotes[emote];
        } else if (origin === 'tmi' && emote in this.twitchEmotes) {
            return this.twitchEmotes[emote];
        }

        return emote;
    }
}

const emoteService = new EmoteService();

export default emoteService;