import { PubSubClient } from '@twurple/pubsub';
import {RefreshingAuthProvider, StaticAuthProvider} from '@twurple/auth';
import {ApiClient, CommercialLength} from '@twurple/api';
import * as fs from 'fs';
import {ChatClient} from "@twurple/chat";
import openAiClient from "./openAiClient";
import TwitchApi from "node-twitch";
import emitter from "../emitter";
import {EventSubWsListener} from "@twurple/eventsub-ws";
import sayService from "../Services/SayService";

class TwitchClient
{
    public pubSubClient: PubSubClient;
    public apiClient: ApiClient;
    public chatClient: ChatClient;
    public twitchApi: TwitchApi;

    private bots: Array<string> = ['sery_bot', 'nightbot', 'streamelements', 'audioalerts', 'streamcaptainbot', 'soundalerts', 'flauschipandabot'];

    constructor() {
        this.initializeTwitchClient();
    }

    initializeTwitchClient = async () => {
        try {
            let self = this;

            // Auth
            const clientId = process.env.CLIENT_ID;
            const clientSecret = process.env.CLIENT_SECRET;

            const tokenData = JSON.parse(fs.readFileSync('./tokens.hannapanda84.json','utf8'));
            const authProvider = new RefreshingAuthProvider({clientId, clientSecret});
            authProvider.onRefresh(async (userId, newTokenData) => {
                fs.writeFileSync(`./tokens.hannapanda84.json`, JSON.stringify(newTokenData, null, 4), {encoding: "utf8"});
            });
            await authProvider.addUserForToken(tokenData, ['chat']);

            const tokenDataBot = JSON.parse(fs.readFileSync('./tokens.flauschipandabot.json','utf8'));
            const authProviderBot = new RefreshingAuthProvider({clientId, clientSecret});
            authProviderBot.onRefresh(async (userId, newTokenData) => {
                fs.writeFileSync(`./tokens.flauschipandabot.json`, JSON.stringify(newTokenData, null, 4), {encoding: "utf8"});
            });
            await authProviderBot.addUserForToken(tokenDataBot, ['chat']);

            // Chat
            this.chatClient = new ChatClient({ authProvider: authProviderBot, channels: ['hannapanda84'], requestMembershipEvents: true });
            this.chatClient.connect();
            this.chatClient.onConnect(async () => {
                console.log("TWURPLE CONNECTED");
                self.chatClient.onJoin(async (channel, username) => {
                    console.log(`JOIN: ${username}`);
                    const isOffensive = await this.checkIsOffensiveUsername(username);
                });
                self.chatClient.onPart(async (channel, username) => {
                    console.log(`PART: ${username}`)
                });
            });
            this.chatClient.onDisconnect((manually, reason) => {
                let interval;

                const tryConnect = () => {
                    try {
                        self.chatClient.connect();
                        clearInterval(interval);
                    } catch(err) {
                        console.log(err);
                    }
                };

                interval = setInterval(tryConnect, 5000);
            });
            this.chatClient.onMessage((channel, user, text, msg) => {
                if (this.bots.includes(msg.userInfo.userName)) {
                    return;
                }

                emitter.emit(
                    'chat.message',
                    msg.text,
                    msg.text.split(' '),
                    {
                        username: msg.userInfo.userName,
                        displayName: msg.userInfo.displayName,
                        mod: msg.userInfo.isMod,
                        vip: msg.userInfo.isVip,
                        owner: msg.userInfo.userName.toLowerCase() === process.env.CHANNEL.toLowerCase()
                    },
                    'tmi',
                    null,
                    null
                );
                console.log(text);
            });

            // API
            this.twitchApi = new TwitchApi({
                client_id: clientId,
                client_secret: clientSecret,
                scopes: ["channel:edit:commercial", "moderation:read"]
            });
            this.apiClient = new ApiClient({ authProvider });
            const user = await this.apiClient.users.getUserByName('hannapanda84');

            // PubSub
            this.pubSubClient = new PubSubClient({ authProvider });
            this.pubSubClient.onRedemption(user.id, async (message) => {
                const isOffensive = await this.checkIsOffensiveUsername(message.userName);

                if(!isOffensive) {
                    emitter.emit('chat.redeem', message);
                }
            });

            // EventSub
            const listener = new EventSubWsListener({ apiClient: this.apiClient });
            listener.start();

            listener.onChannelFollow(user, user, async (event) => {
                const isOffensive = await this.checkIsOffensiveUsername(event.userName);
            });

            listener.onChannelSubscription(user, (event) => {

            });

            listener.onChannelSubscriptionGift(user, (event) => {

            });

            listener.onChannelRaidTo(user, (event) => {

            });

            listener.onChannelCheer(user, (event) => {

            });

            listener.onChannelRaidTo(user, (event) => {
                sayService.say('tmi', '', '', null, `Vielen Dank für den Raid ${event.raidingBroadcasterDisplayName} ヽ(゜∇゜)ノ`)
                sayService.say('tmi', '', '', null, `Hey ihr Flauschis, schaut doch mal bei ${event.raidingBroadcasterDisplayName} rein! https://twitch.tv/${event.raidingBroadcasterName}`)
                this.apiClient.chat.shoutoutUser(user, event.raidedBroadcasterId);
                emitter.emit('playAudio', {file: 'skibidi.mp3', mediaType: 'audio', volume: 0.25});
                emitter.emit('bot.say', 'Willkommen im beklopptesten Stream auf Twitch ihr flauschigen Raider!');
            });
        } catch(err) {
            console.error(err);
        }
    };

    startCommercial = async (duration: CommercialLength = 30) => {
        try {
            await this.apiClient.channels.startChannelCommercial(await this.apiClient.users.getUserByName('hannapanda84'), duration);
        } catch(err) {
            console.warn(err);
        }
    }

    checkIsOffensiveUsername = async (username: string) => {
        const score = await openAiClient.getUsernameOffenseScore(username);
        if(score >= 0.5) {
            console.log(`Banning user ${username} due to offensive username (Score ${score})`);
            try {
                const broadcaster = await this.apiClient.users.getUserByName('hannapanda84');
                const user = await this.apiClient.users.getUserByName(username);
                await this.apiClient.moderation.banUser(
                    broadcaster,
                    {
                        reason: "Offensive username",
                        user: user
                    }
                );
                return Promise.resolve(true);
            } catch(err) {
                console.log(err);
            }
        } else {
            console.log(`Checked user ${username} (Score ${score})`);
        }

        return Promise.resolve(false);
    }
}

const twitchClient = new TwitchClient();

export default twitchClient;