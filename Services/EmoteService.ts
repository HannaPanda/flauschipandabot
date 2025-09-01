import discordClient from "../Clients/discordClient";

class EmoteService
{
    discordEmotes = {
        'hype': 'hannap5PandaHype',
        'greet': 'wave~1',
        'heart': 'hannap5Heart',
        'angry': 'angry~1',
        'stinky': 'skunk',
        'bleed': 'cloud_rain',
        'unity': 'hannap5Heart',
        'woah': 'Woah112',
        'sleep': 'zzz~1',
        'rave': 'hannap5Rave'
    };

    twitchEmotes = {
        'hype': 'hannap5PandaHype',
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

    botTwitchEmotes = [
        'hannap5PandaHype',
        'hannap5Bongo',
        'hannap5Need',
        'hannap5Lurk',
        'hannap5Pat',
        'hannap5Coffee',
        'hannap5Hehe',
        'hannap5Angry',
        'hannap5OhNo',
        'hannap5Sleep',
        'hannap5Rave',
        'hannap5PandaWoah',
        'hannap5Wave',
        'hannap5Heart',
        'hannap5Giggle',
        'hannap5Blanket',
        'hannap5Fire',
        'hannap5Knife',
        'hannap5Goofy',
        'hannap5Shy',
        'hannap5Facepalm',
        'hannap5Ded',
        'hannap5Evil',
        'hannap5Uh',
        'hannap5Cry',
        'hannap5Love',
        'hannap5Oh',
    ];

    getEmote = (origin: string, emote: string) => {
        emote = emote.replace('emote_', '');

        if(origin === 'discord' && emote in this.discordEmotes) {
            return discordClient.emojis.cache.find(emoji => emoji.name === this.discordEmotes[emote]) ?? this.discordEmotes[emote];
        } else if (origin === 'twitch' && emote in this.twitchEmotes) {
            return this.twitchEmotes[emote];
        }

        return emote;
    };

    getBotTwitchEmotes = () => {
        return this.botTwitchEmotes.join(' ');
    };

    replaceTwitchEmotesWithDiscord = (text) => {
        const regex = new RegExp(this.botTwitchEmotes.join('|'), 'gi');
        return text.replace(
            regex,
            (emote) => { return discordClient.emojis.cache.find(emoji => emoji.name === emote) ?? emote; }
        );
    };
}

const emoteService = new EmoteService();

export default emoteService;
