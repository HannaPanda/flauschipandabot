import * as dotenv from "dotenv";
import {MongoClient} from "mongodb";

dotenv.config({ path: __dirname+'/../.env' });

class Initializer
{
    public mongoDBClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

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
    }
}

let initializer = new Initializer();

export default initializer.mongoDBClient;