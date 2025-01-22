import emitter from "../emitter";
import * as Discord from 'discord.js';
import { Message } from 'discord.js';
import { ChatMessageEvent, eventManager } from "../Services/EventManager";
import { Env } from "../Config/Environment";

const discordClient = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS']});

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.login(Env.botDiscordClientToken).catch(err => console.log(err));

discordClient.on('messageCreate', async (message: Message) => {

    const cleanedString = message.content.replace(/<:([^:]+):\d+>/g, '$1');

    // v2
    const event: ChatMessageEvent = {
        message: cleanedString,
        tokens: cleanedString.split(' '),
        user: {
            userName: message.author.username,
            displayName: message.author.username,
            mod: message.member?.roles.cache.some((role: any) => role.name === 'Flausch-Polizei') || false,
            vip: false,
            owner: message.member?.roles.cache.some((role: any) => role.name === 'Mama Flausch') || false,
        },
        platform: 'discord',
        channel: message.channel,
        rawMessage: message,
    };
    eventManager.emitChatMessage(event);

    // v1 for legacy purposes until switched
    emitter.emit(
        'chat.message',
        cleanedString,
        cleanedString.split(' '),
        {
            userName: message.author.username,
            displayName: message.author,
            mod: (message.member.roles.cache.some(role => role.name === 'Flausch-Polizei')),
            vip: false,
            owner: (message.member.roles.cache.some(role => role.name === 'Mama Flausch'))
        },
        'discord',
        message.channel,
        message
    );
});

export default discordClient;
