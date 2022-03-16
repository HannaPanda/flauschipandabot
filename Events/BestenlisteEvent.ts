import emitter from "../emitter";
import * as dotenv from "dotenv";
import mongoDBClient from "../Clients/mongoDBClient";
dotenv.config({ path: __dirname+'/../.env' });

class BestenlisteEvent
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

        if(!/^!bestenliste/i.test(message)) {
            return Promise.resolve(false);
        }

        const userList = await mongoDBClient
            .db("flauschipandabot")
            .collection("poofed_users")
            .find({}, {sort: {seconds: "desc"}})
            .limit(5);

        let platz = 1;
        await userList.forEach((document) => {
            emitter.emit('tmi.say', `Platz ${platz++}: ${document.name} mit ${document.seconds} Sekunden`);
        });

        return Promise.resolve(true)
    }
}

let bestenlisteEvent = new BestenlisteEvent();

export default bestenlisteEvent;