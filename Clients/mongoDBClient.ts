import * as dotenv from "dotenv";
import {MongoClient} from "mongodb";
import * as mongoose from "mongoose";

dotenv.config({ path: __dirname+'/../.env' });

class Initializer
{
    public mongoDBClient = new MongoClient(
        process.env.MONGODB_CONNECTION_STRING,
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
            await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {});
            console.log("Mit MongoDB verbunden");
        } catch (err) {
            console.warn("Fehler beim Verbinden mit MongoDB:", err);
        }
    }
}

let initializer = new Initializer();

export default initializer.mongoDBClient;