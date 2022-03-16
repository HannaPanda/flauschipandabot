import * as dotenv from "dotenv";
import fetch from "node-fetch";
import discordClient from "../Clients/discordClient";
dotenv.config({ path: __dirname+'/../.env' });

class ChattersService
{
    getChattersList = async (origin = 'tmi') => {
        let chatters: Array<string> = [];
console.log(origin);
        if(origin === 'tmi') {
            const fetch = require('node-fetch');
            const chatterInfo = await fetch(`https://tmi.twitch.tv/group/user/${process.env.CHANNEL}/chatters`, {method: "Get"})
                .then(res => res.json())
                .catch(err => {console.log(err)});

            if(chatterInfo && chatterInfo.chatters) {
                chatters = [].concat(...Object.values(chatterInfo.chatters));
            } else {
                chatters = [];
            }

            return Promise.resolve(chatters);
        } else if(origin === 'discord') {
            console.log("test");
            const guild = await discordClient.guilds.cache.get(process.env.DISCORD_GUILD_ID);
            const chatterInfo = await guild.members.fetch();

            console.log("###################");
            console.log(chatterInfo);
            console.log("###################");

            return Promise.resolve(chatters);
        }

        return Promise.resolve(chatters);
    }
}

const chattersService = new ChattersService();

export default chattersService;