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
    /*console.log(await chattersService.getChattersList('discord'));*/

    emitter.emit(
        'chat.message',
        message.content,
        message.content.split(' '),
        {username: message.author.username, 'display-name': message.author},
        'discord',
        message.channel,
        message
    );
});

export default discordClient;