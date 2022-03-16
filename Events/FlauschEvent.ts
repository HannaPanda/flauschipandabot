import emitter from "../emitter";
import mongoDBClient from "../Clients/mongoDBClient";
import * as dotenv from "dotenv";
import emoteService from "../Services/EmoteService";
dotenv.config({ path: __dirname+'/../.env' });

class FlauschEvent
{
    isActive = true;

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    private handleEvent = async (message, parts, context, origin = 'tmi', channel = null) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        if(/flausch/i.test(message)) {
            let username = (origin === 'tmi') ? context['display-name'] : context.username.username;

            const flauschUsers = mongoDBClient.db("flauschipandabot").collection("flausch_users");
            let user = await flauschUsers.findOne({name: username}, {});
            if(!user) {
                await flauschUsers.insertOne({name: username, times: 1});
            } else {
                await flauschUsers.updateOne({name: username}, {$set: {name: username, times: (user.times + 1)}});
            }

            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
}

let flauschEvent = new FlauschEvent();

export default flauschEvent;