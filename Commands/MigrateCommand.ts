import emitter from "../emitter";
import * as dotenv from "dotenv";
import AbstractCommand from "../Abstracts/AbstractCommand";
import mongoDBClient from "../Clients/mongoDBClient";
import Fighter from "../Models/Fighter";
import sayService from "../Services/SayService";
import moment from "moment";
dotenv.config({ path: __dirname+'/../.env' });

class MigrateCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = true;
    isAggressive   = false;
    command        = 'migrate';
    description    = 'Datenbank migrieren';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

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

    /*updateFighter = async (username) => {
        const fighter = new Fighter();
        await fighter.init(username);
        //await fighter.set('disease', fighter.get('disease') ?? false).set('incurableDisease', fighter.get('incurableDisease') ?? false).update();
        await fighter.set('isAsleepUntil', moment().subtract(1, 'year').format()).update();

        return Promise.resolve(true);
    }*/
}

let migrateCommand = new MigrateCommand();

export default migrateCommand;