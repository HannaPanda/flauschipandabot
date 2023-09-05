import { PubSubClient } from '@twurple/pubsub';
import {RefreshingAuthProvider} from '@twurple/auth';
import {ApiClient, CommercialLength} from '@twurple/api';
import * as fs from 'fs';
import {ChatClient} from "@twurple/chat";
import openAiClient from "./openAiClient";
import emitter from "../emitter";
import {EventSubWsListener} from "@twurple/eventsub-ws";
import sayService from "../Services/SayService";
import server from '../server';

class TwitchClient
{
    public pubSubClient: PubSubClient;
    public apiClient: ApiClient;
    public chatClient: ChatClient;

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
                        userName: msg.userInfo.userName,
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
            this.pubSubClient.onSubscription(user.id, async (message) => {
                const isOffensive = await this.checkIsOffensiveUsername(message.userName);

                if(isOffensive || message.isGift || message.isAnonymous) {
                    return;
                }

                let infoMessage = ``;
                if(message.months > 1) {
                    infoMessage += `Willkommen zurück im Bambuswald, ${message.userDisplayName}!<br>Danke für ${message.months} flauschige Monate bei uns!`
                } else {
                    infoMessage = `Ein wilder Flauschi taucht auf! Willkommen in der Panda-Bande, ${message.userDisplayName}!<br>Lass uns gemeinsam Bambus knabbern!`;
                }

                const alert = {
                    imageUrl: '/static/images/alerts/subscriber.gif',
                    soundUrl: '/static/audio/kitty2.mp3',
                    volume: 0.25,
                    infomessage: infoMessage,
                    inputmessage: message.message.message || '',
                }
                server.getIO().emit('showAlert', alert);

                if(message.message.message) {
                    server.getIO().emit('bot.say.notext', message.message.message);
                }
            });

            // EventSub
            const listener = new EventSubWsListener({ apiClient: this.apiClient });
            listener.start();

            listener.onChannelFollow(user, user, async (event) => {
                const isOffensive = await this.checkIsOffensiveUsername(event.userName);
                if(!isOffensive) {
                    const alert = {
                        imageUrl: '/static/images/alerts/follower.gif',
                        soundUrl: '/static/audio/cats.mp3',
                        volume: 0.25,
                        infomessage: `Ein weiterer Panda ist unserer Panda-Bande beigetreten!<br>Hallo ${event.userDisplayName} und willkommen bei den Flauschis!`,
                        inputmessage: '',
                    }
                    server.getIO().emit('showAlert', alert);
                }
            });

            listener.onChannelSubscriptionGift(user, async (event) => {
                const isOffensive = await this.checkIsOffensiveUsername(event.gifterName);
                if(!isOffensive) {
                    const alert = {
                        imageUrl: '/static/images/alerts/subscriber.gif',
                        soundUrl: '/static/audio/kitty2.mp3',
                        volume: 0.25,
                        infomessage: `So viel Liebe! ${event.gifterDisplayName} hat ${event.amount} Bambuszweige<br> an unsere Community verteilt! Danke für die Giftsubs!`,
                        inputmessage: '',
                    }
                    server.getIO().emit('showAlert', alert);
                }
            });

            listener.onChannelCheer(user, async (event) => {
                const isOffensive = await this.checkIsOffensiveUsername(event.userName);
                if(!isOffensive) {
                    const alert = {
                        imageUrl: '/static/images/alerts/cheer.gif',
                        soundUrl: '/static/audio/cats.mp3',
                        volume: 0.25,
                        infomessage: `${event.userDisplayName} lässt die Bambusmünzen regnen! Danke für die ${event.bits} Bits!`,
                        inputmessage: event.message || '',
                    }
                    server.getIO().emit('showAlert', alert);

                    if(event.message) {
                        server.getIO().emit('bot.say.notext', event.message);
                    }
                }
            });

            listener.onChannelRaidTo (user, async (event) => {
                const isOffensive = await this.checkIsOffensiveUsername(event.raidingBroadcasterName);
                if(!isOffensive) {
                    const alert = {
                        imageUrl: '/static/images/alerts/raid.gif',
                        soundUrl: '/static/audio/skibidi.mp3',
                        volume: 0.25,
                        infomessage: `${event.raidingBroadcasterDisplayName} stürmt uns mit ${event.viewers} Pandas!`,
                        inputmessage: '',
                    }
                    server.getIO().emit('showAlert', alert);

                    sayService.say('tmi', '', '', null, `emote_hype emote_hype emote_hype Vielen Dank für den Raid ${event.raidingBroadcasterDisplayName} emote_hype emote_hype emote_hype`)
                    sayService.say('tmi', '', '', null, `emote_heart emote_heart emote_heart Hey ihr Flauschis, schaut doch mal bei ${event.raidingBroadcasterDisplayName} rein! https://twitch.tv/${event.raidingBroadcasterName} emote_heart emote_heart emote_heart`)
                    this.apiClient.chat.shoutoutUser(user, event.raidedBroadcasterId);
                    server.getIO().emit('bot.say.notext', 'Willkommen im beklopptesten Stream auf Twitch ihr flauschigen Raider!');
                }
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