import {MongoClient} from "mongodb";
import * as mongoose from "mongoose";
import { Env } from "../Config/Environment";

class Initializer
{
    public mongoDBClient = new MongoClient(
        Env.mongoDbConnectionString,
    {}
    );

    constructor()
    {
        this.connectDB();
    }

    private connectDB = async () => {
        try {
            await this.mongoDBClient.connect();
        } catch (err) {
            console.warn(err);
        }

        try {
            await mongoose.connect(Env.mongoDbConnectionString, {});
            console.log("Mit MongoDB verbunden");
        } catch (err) {
            console.warn("Fehler beim Verbinden mit MongoDB:", err);
        }
    }
}

let initializer = new Initializer();

export default initializer.mongoDBClient;
