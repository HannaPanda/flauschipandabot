import { PubSubClient } from '@twurple/pubsub';
import { RefreshingAuthProvider } from '@twurple/auth';
import {ApiClient, CommercialLength} from '@twurple/api';
import * as fs from 'fs';
import emitter from "../emitter";

class TwitchClient
{
    public pubSubClient: PubSubClient;
    public apiClient: ApiClient;

    constructor() {
        this.initializeTwitchClient();
    }

    initializeTwitchClient = async () => {
        try {
            const clientId = process.env.CLIENT_ID;
            const clientSecret = process.env.CLIENT_SECRET;
            const tokenData = JSON.parse(fs.readFileSync('./tokens.json','utf8'));
            const authProvider = new RefreshingAuthProvider(
                {
                    clientId,
                    clientSecret,
                    onRefresh: async newTokenData => await fs.writeFileSync('./tokens.json', JSON.stringify(newTokenData, null, 4), {})
                },
                tokenData
            );
            this.pubSubClient = new PubSubClient();
            const userId = await this.pubSubClient.registerUserListener(authProvider);
            const listener = await this.pubSubClient.onRedemption(userId, (message) => {
                emitter.emit('chat.redeem', message);
            });

            this.apiClient = new ApiClient({ authProvider });
        } catch(err) {
            console.error(err);
        }
    }

    startCommercial = async (duration: CommercialLength = 30) => {
        try {
            await this.apiClient.channels.startChannelCommercial(await this.apiClient.users.getUserByName('hannapanda84'), duration);
        } catch(err) {
            console.warn(err);
        }
    }
}

const twitchClient = new TwitchClient();

export default twitchClient;