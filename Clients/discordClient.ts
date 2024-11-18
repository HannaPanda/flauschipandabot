import emitter from "../emitter";
import * as Discord from 'discord.js';
import { Message } from 'discord.js';

const discordClient = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS']});

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.login(process.env.BOT_DISCORD_CLIENT_TOKEN).catch(err => console.log(err));

discordClient.on('messageCreate', async (message: Message) => {

    const cleanedString = message.content.replace(/<:([^:]+):\d+>/g, '$1');

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
