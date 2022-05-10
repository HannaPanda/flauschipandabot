import * as dotenv from "dotenv";
import discordClient from "../Clients/discordClient";
dotenv.config({ path: __dirname+'/../.env' });

class BotService
{
    botActive = true;
    setInactive = () => {
        this.botActive = false;
        setTimeout(() => {
            this.botActive = true;
        }, 600000)
    }
}

const botService = new BotService();

export default botService;