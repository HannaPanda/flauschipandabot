import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import sayService from "../Services/SayService";
dotenv.config({ path: __dirname+'/../.env' });

class MigrateCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = true;
    command        = 'migrate';
    description    = 'Datenbank migrieren';
    answerNoTarget = '';
    answerTarget   = '';

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        /*let allUsers = await mongoDBClient
            .db("flauschipandabot")
            .collection("fighters")
            .find();

        while(await allUsers.hasNext()) {
            const user = await allUsers.next();
            this.updateFighter(user.name);
        }*/

        /*let allQuotes = await mongoDBClient
            .db("flauschipandabot")
            .collection("quotes")
            .find();
        while(await allQuotes.hasNext()) {
            const quote = await allQuotes.next();
            await mongoDBClient
                .db("flauschipandabot")
                .collection("quotes")
                .updateOne(
                    {id: quote.id},
                    {
                        $set: {
                            id:         quote.id,
                            quote:      quote.quote,
                            date:       new Date().toLocaleDateString('de-DE'),
                            isApproved: true
                        }
                    }
                );
        }*/

        sayService.say('tmi', '', '', null, 'Migration fertig');
    }

    updateFighter = async (username) => {
        /*const fighter = new Fighter();
        await fighter.init(username);
        await fighter.set('immunity', fighter.get('immunity') ?? 0).update();*/

        return Promise.resolve(true);
    }
}

let migrateCommand = new MigrateCommand();

export default migrateCommand;