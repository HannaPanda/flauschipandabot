import * as dotenv from "dotenv";
import discordClient from "../Clients/discordClient";
import openAiClient from "../Clients/openAiClient";
import emoteService from "./EmoteService";
dotenv.config({ path: __dirname+'/../.env' });

class StoryService {

    private storySeeds = [
        { prompt: 'Schreibe eine witzige Geschichte über das Pandamädchen Hanna und ihre treue Brezel in 200 Zeichen.', user: 'killerpretzel' },
        { prompt: 'Schreibe eine witzige Geschichte über die liebe Vipera, die Kaiserin des Rosenkohl (auch bekannt als Giftgasbällchen) in 200 Zeichen.', user: 'vipera_ivanesca' },
        { prompt: 'Schreibe eine witzige Geschichte über den Cringe-König Juki in 200 Zeichen.', user: 'koenigjuki' },
        { prompt: 'Schreibe eine witzige Geschichte über Tabsi (sie), die Wasser über alles mag in 200 Zeichen. Ende die Geschichte mit "Auf Tabsi!"', user: 'tabsi12345' },
        { prompt: 'Schreibe eine witzige Geschichte über eine Brezel, die IT über alles hasst in 200 Zeichen.', user: 'killerpretzel' },
        { prompt: 'Schreibe eine witzige Geschichte über Yoshi (er/ihm) und süße Stofftiere in 200 Zeichen.', user: 'yoshi_das_flohfell' },
        { prompt: 'Schreibe eine witzige Geschichte über Lormos und wie er den Chat vor der Auslöschung mit Kaffee und einem Feuerball gerettet hat in 200 Zeichen.', user: 'lormos' },
        { prompt: 'Schreibe eine witzige Geschichte über Katzen, die ein Abenteuer erleben in 200 Zeichen.', user: '' },
        { prompt: 'Schreibe eine witzige Geschichte über Katja und ihren Garten in 200 Zeichen.', user: 'katja_on' },
        { prompt: 'Schreibe eine witzige Geschichte über Katja die Busfahrerin mit dem Ticket zum Mond in 200 Zeichen.', user: 'katja_on' },
        { prompt: 'Schreibe eine witzige Geschichte über einen rosa Panda in 200 Zeichen.', user: '' },
        { prompt: 'Schreibe eine witzige Geschichte über das Panda-Mädchen Hanna und Fallschaden in 200 Zeichen.', user: 'hannapanda84' },
        { prompt: 'Schreibe eine witzige Geschichte über das Panda-Mädchen Hanna und ihre herausragenden Fahrkünste in 200 Zeichen.', user: 'hannapanda84' },
        { prompt: 'Schreibe eine witzige Geschichte über Fledermäuse und Fahrstühle in 200 Zeichen.', user: '' },
        { prompt: 'Schreibe eine witzige Geschichte über Zoidberg, der gerne mit großen Einkaufstüten einkaufen geht in 200 Zeichen.', user: 'killerpretzel' },
        { prompt: 'Schreibe eine witzige Geschichte über Moon, eine Raumfahrerin und Farmerin in 200 Zeichen.', user: '19moon82' },
        { prompt: 'Schreibe eine witzige Geschichte über Tom, der aus dem Westen kommt in 200 Zeichen.', user: 'tom_west' },
        { prompt: 'Schreibe eine witzige Geschichte über die Panda-Dame Hanna und ihr gespanntes Verhältnis mit Lakritze in 200 Zeichen.', user: 'hannapanda84' },
        { prompt: 'Schreibe eine witzige Geschichte über die Panda-Krankenschwester Hanna und Wassermelonen in 200 Zeichen.', user: 'hannapanda84' },
        { prompt: 'Schreibe eine witzige Geschichte über Fräulein Herbert, die immer Hanna erschrecken will in 200 Zeichen.', user: 'fraeuleinherbert' },
        { prompt: 'Schreibe eine witzige Geschichte über Bai Long, den weißen Drachen in 200 Zeichen.', user: 'vipera_ivanesca' },
        { prompt: 'Schreibe eine witzige Geschichte über Hanna, das Panda-Mädchen, das sie das Fluchen nicht abgewöhnen kann in 200 Zeichen.', user: 'hannapanda84' },
    ];

    public getRandomStory = async () => {

        const response = await openAiClient.getCustomChatGPTResponse(
            `Antworte als niedlicher Panda mit vielen süßen Emotes. Dein Name ist FlauschiPandaBot und deine Mama ist HannaPanda84 (Hanna). Nutze "Ich", um auf dich zu referenzieren.
             Nutze genderneutrale Sprache.
             Nutze ausschließlich folgende Emotes:  
             ${emoteService.getBotTwitchEmotes()}
             Nutze das Wort "Flausch" so oft es geht.`,
            this.storySeeds[Math.floor(Math.random() * this.storySeeds.length)].prompt,
            null,
            false
        );

        return response;

        /*const regex = /^FlauschiPandaBot: "(.*)"$/;
        const result = response.match(regex)[1];

        return result;*/
    };

    public getUserStory = async (user) => {

        let storySeeds = this.storySeeds.filter(entry => entry.user === user).slice();

        if(storySeeds.length > 0) {
            const response = await openAiClient.getCustomChatGPTResponse(
                `Antworte als niedlicher Panda mit vielen süßen Emotes. Dein Name ist FlauschiPandaBot und deine Mama ist HannaPanda84 (Hanna). Nutze "Ich", um auf dich zu referenzieren.
             Nutze genderneutrale Sprache.
             Nutze ausschließlich folgende Emotes:
             ${emoteService.getBotTwitchEmotes()}
             Nutze das Wort "Flausch" so oft es geht.`,
                storySeeds[Math.floor(Math.random() * storySeeds.length)].prompt,
                null,
                false
            );

            return response;
        } else {
            const response = await openAiClient.getCustomChatGPTResponse(
                `Antworte als niedlicher Panda mit vielen süßen Emotes. Dein Name ist FlauschiPandaBot und deine Mama ist HannaPanda84 (Hanna). Nutze "Ich", um auf dich zu referenzieren.
             Nutze genderneutrale Sprache.
             Nutze ausschließlich folgende Emotes:
             ${emoteService.getBotTwitchEmotes()}
             Nutze das Wort "Flausch" so oft es geht.`,
                `Schreibe eine witzige Geschichte über den User ${user} in 200 Zeichen`,
                null,
                false
            );

            return response;
        }

    }
}

const storyService = new StoryService();

export default storyService;