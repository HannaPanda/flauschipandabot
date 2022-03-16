import * as dotenv from "dotenv";
import discordClient from "../Clients/discordClient";
dotenv.config({ path: __dirname+'/../.env' });

class StreamService
{
    currentStream;
}

const streamService = new StreamService();

export default streamService;