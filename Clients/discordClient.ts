import emitter from "../emitter";
import * as dotenv from "dotenv";
import {ClientOptions} from "discord.js";
import chattersService from "../Services/ChattersService";

const Discord = require('discord.js');
const discordClient = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS']});

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.login(process.env.BOT_DISCORD_CLIENT_TOKEN);

discordClient.on('messageCreate', async (message) => {
    emitter.emit(
        'chat.message',
        message.content,
        message.content.split(' '),
        {
            username: message.author.username,
            'display-name': message.author,
            mod: (message.member.roles.cache.some(role => role.name === 'Flausch-Polizei')),
            owner: (message.member.roles.cache.some(role => role.name === 'Mama Flausch'))
        },
        'discord',
        message.channel,
        message
    );
});

export default discordClient;