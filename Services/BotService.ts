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
