import emitter from "../emitter";
import * as dotenv from "dotenv";
import mongoDBClient from "../Clients/mongoDBClient";
import tmiClient from "../Clients/tmiClient";
dotenv.config({ path: __dirname+'/../.env' });

class PoofEvent
{
    isActive = false;

    constructor()
    {
        emitter.on('chat.message', this.handleEvent);
    }

    private handleEvent = async (message, parts, context) => {
        if(!this.isActive) {
            return Promise.resolve(false);
        }

        if(!/^!poof/i.test(message)) {
            return Promise.resolve(false);
        }

        const poofedUsers = mongoDBClient.db("flauschipandabot").collection("poofed_users");

        let timeoutSeconds = Math.floor(Math.random() * 999 + 1);
        for(let i = 1; i < 5; i++) {
            let temp = Math.floor(Math.random() * 999 + 1);
            if(temp < timeoutSeconds) {
                timeoutSeconds = temp;
            }
        }

        tmiClient.timeout(process.env.CHANNEL, context['display-name'], timeoutSeconds, '').catch((err) => {console.warn(err)});
        emitter.emit('tmi.say', `${context['display-name']} hat mit dem Feuer gespielt und sich einen Timeout von ${timeoutSeconds} Sekunden gegönnt ( ﾟдﾟ)`)

        let user = await poofedUsers.findOne({name: context['display-name']}, {});
        if(!user) {
            await poofedUsers.insertOne({name: context['display-name'], seconds: timeoutSeconds});
        } else if(user.seconds < timeoutSeconds) {
            await poofedUsers.updateOne({name: context['display-name']}, {$set: {name: context['display-name'], seconds: timeoutSeconds}});
        }

        const userList = await poofedUsers.find({}, {sort: {seconds: "desc"}});
        let userPlace = 1;
        let userFound = false;
        let entry;
        await userList.forEach((document) => {

            if(document.name === context['display-name']) {
                userFound = true;
                entry = document;
            }

            if(userFound) {
                return;
            }

            userPlace++;
        });
        emitter.emit('tmi.say', `${context['display-name']} ist auf Platz ${userPlace} mit einem Höchstwert von ${entry.seconds} Sekunden`)

        return Promise.resolve(true)
    }
}

let poofEvent = new PoofEvent();

export default poofEvent;