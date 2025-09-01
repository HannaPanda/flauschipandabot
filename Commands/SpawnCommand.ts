import AbstractCommand from "../Abstracts/AbstractCommand";
import wss from "../Clients/wssClient";
import openAiClient from "../Clients/openAiClient";

class HypeCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isVipOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'spawn';
    description    = 'Jetzt lassen wir was in Skyrim spawnen';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    skyrimWeapons = [
        { name: "Iron Sword", formID: "00012EB7" },
        { name: "Steel Greatsword", formID: "00013987" },
        { name: "Dwarven Sword", formID: "00013999" },
        { name: "Ebony Dagger", formID: "000139AE" },
        { name: "Elven Bow", formID: "0001399D" },
        { name: "Glass Warhammer", formID: "000139AA" },
        { name: "Nord Hero Sword", formID: "00068C7B" },
        { name: "Orcish Battleaxe", formID: "0001398C" },
        { name: "Silver Sword", formID: "0010AA19" },
        { name: "Skyforge Steel Dagger", formID: "0009F25D" },
        { name: "Steel Arrow", formID: "0001397F" },
        { name: "Daedric Arrow", formID: "000139C0" },
        { name: "Blade of Sacrifice", formID: "00079B1D" },
        { name: "Bow of the Hunt", formID: "000AB705" },
        { name: "Chillrend", formID: "000F8313" },
        { name: "Daedric Sword", formID: "000139B9" },
        { name: "Ebony Blade", formID: "0004A38F" },
        { name: "Elven Dagger", formID: "0001399E" },
        { name: "Fork", formID: "0001F25B" },
        { name: "Staff of Frostbite", formID: "0004DEE1" },
        { name: "Glass Bow", formID: "000139A5" },
        { name: "Hunting Bow", formID: "0006E03C" },
        { name: "Imperial Bow", formID: "00013841" },
        { name: "Mace of Molag Bal", formID: "000233E3" },
        { name: "Orcish Sword", formID: "00013991" },
        { name: "Steel Battleaxe", formID: "00013984" }
    ];

    skyrimArmors = [
        { name: "Ancient Nord Armor", formID: "00018388" },
        { name: "Black Mage Robes", formID: "000C5D11" },
        { name: "Dwarven Armor", formID: "0001394D" },
        { name: "Ebony Mail", formID: "00052794" },
        { name: "Elven Armor", formID: "000896A3" },
        { name: "Fur Armor", formID: "0006F393" },
        { name: "Glass Armor", formID: "00013939" },
        { name: "Hide Armor", formID: "00013911" },
        { name: "Imperial Armor", formID: "000136D5" },
        { name: "Iron Armor", formID: "00012E49" },
        { name: "Leather Armor", formID: "0003619E" },
        { name: "Nightingale Armor", formID: "000483C2" },
        { name: "Orcish Armor", formID: "00013957" },
        { name: "Scaled Armor", formID: "0001B3A3" },
        { name: "Steel Armor", formID: "00013952" },
        { name: "Stormcloak Officer Armor", formID: "0008697E" },
        { name: "Thalmor Robes", formID: "00065BBF" },
        { name: "Wolf Armor", formID: "000CAE15" },
        { name: "Alik'r Hood", formID: "0007BC1A" },
        { name: "Daedric Armor", formID: "000F1ABE" },
        { name: "Dragonscale Armor", formID: "0001393E" },
        { name: "Dwarven Armor of Eminent Health", formID: "0001B3DA" },
        { name: "Ebony Armor", formID: "00013961" },
        { name: "Elven Armor of Eminent Health", formID: "000BE03D" },
        { name: "Glass Armor of Eminent Health", formID: "000D5382" },
        { name: "Imperial Light Armor", formID: "00013ED9" }
    ];

    skyrimPotions = [
        { name: "Elixir of Health", formID: "000FF9FC" },
        { name: "Elixir of Strength", formID: "000FF9FE" },
        { name: "Hagraven Claw", formID: "0006B689" },
        { name: "Potion of Healing", formID: "0003EADE" },
        { name: "Potion of Minor Healing", formID: "0003EADD" },
        { name: "Potion of Minor Stamina", formID: "0003EAE5" }
    ];

    skyrimFoods = [
        { name: "Apple", formID: "00064B2F" },
        { name: "Baked Potato", formID: "00064B3A" },
        { name: "Beef Stew", formID: "000F4314" },
        { name: "Boiled Creme Treat", formID: "00064B30" },
        { name: "Bread", formID: "00065C97" },
        { name: "Cabbage", formID: "00064B3F" },
        { name: "Cooked Beef", formID: "000721E8" },
        { name: "Elsweyr Fondue", formID: "000F4320" },
        { name: "Grilled Chicken Breast", formID: "000E8947" },
        { name: "Honey Nut Treat", formID: "00064B38" },
        { name: "Horker Stew", formID: "000F4315" },
        { name: "Horse Haunch", formID: "000722B0" },
        { name: "Mead", formID: "000508CA" },
        { name: "Nord Mead", formID: "00034C5D" },
        { name: "Potato", formID: "00064B41" },
        { name: "Rabbit Haunch", formID: "000722C2" },
        { name: "Salmon Steak", formID: "00064B3B" },
        { name: "Sweet Roll", formID: "00064B3D" },
        { name: "Tomato", formID: "00064B42" },
        { name: "Vegetable Soup", formID: "000F431E" },
        { name: "Venison Chop", formID: "000722BD" },
        { name: "Water", formID: "000A9661" },
        { name: "Wine", formID: "0003133C" },
        { name: "Cheese", formID: "00064B33" },
        { name: "Black-Briar Reserve", formID: "000F693F" }
    ];

    skyrimMobs = [
        { name: "Frost Troll", formID: "00023ABB" },
        { name: "Draugr Death Overlord", formID: "0004247E" },
        { name: "Skeever", formID: "00023AB7" },
        { name: "Giant", formID: "00023AAE" },
        { name: "Goat", formID: "0002EBE2" },
        { name: "Dog", formID: "00023A92" },
        { name: "Sabre Cat", formID: "00023AB5" },
        { name: "Dwarven Centurion", formID: "0010F9B9" },
        { name: "Falmer Shadowmaster", formID: "0003B54F" },
        { name: "Dragon Priest", formID: "00023A93" },
        { name: "Spriggan", formID: "00023AB9" },
        { name: "Dremora", formID: "0010DDEE" },
        { name: "Mudcrab", formID: "000E4011" },
        { name: "Bandit Chief", formID: "0003DF17" },
        { name: "Draugr Deathlord", formID: "0003B54B" },
        { name: "Frostbite Spider", formID: "0004203F" },
        { name: "Necromancer", formID: "00028502" },
        { name: "Hagraven", formID: "00023AB0" },
        { name: "Ice Wraith", formID: "00023AB3" },
        { name: "Slaughterfish", formID: "00023AB8" },
        { name: "Vampire", formID: "00032FE8" },
        { name: "Wispmother", formID: "00023ABD" },
        { name: "Troll", formID: "00023ABA" },
        { name: "Frost Atronach", formID: "00023AA7" },
        { name: "Giant Frostbite Spider", formID: "00023AAD" },
        { name: "Chicken", formID: "000A91A0" },
        { name: "Dwarven Spider", formID: "00023A98" }
    ];

    getCommaSeparatedValues<T>(list: T[], attributeName: keyof T): string {
        const values: string[] = list.map((item) => String(item[attributeName]));
        return values.join(", ");
    }

    findFormIDByName(name: string, objects: { name: string, formID: string }[], charsToRemove = /[^a-z ]/gi): string | undefined {
        const cleanedName = name.replace(charsToRemove, "").trim();
        const foundObject = objects.find((obj) => obj.name.toLowerCase() === cleanedName.toLowerCase());
        return foundObject ? foundObject.formID : undefined;
    }

    ensureValidHexNumber = (hexString: string): string => {
        // Überprüfen, ob der String mit "0x" beginnt
        if (!hexString.startsWith("0x")) {
            hexString = "0x" + hexString;
        }

        // Überprüfen, ob der String eine gültige Hexadezimalzahl ist
        if (!/^(0x)?[0-9A-Fa-f]+$/.test(hexString)) {
            throw new Error("Ungültige Hexadezimalzahl!");
        }

        // Rückgabe des Strings, falls er gültig ist
        return hexString;
    }

    getRandomNumber = (): number => {
        const max = 100;
        const min = 1;
        const rarityFactor = 10; // Anzahl an Zahlen pro "Seltenheitsstufe"
        const rarityWeights = [70, 10, 5, 2, 2, 2, 2, 1, 1, 1]; // Gewichte für jede Seltenheitsstufe

        // Reduziere die Seltenheit für Zahlen über 10
        rarityWeights.splice(1).forEach((weight, index) => {
            rarityWeights[index + 1] = weight * 0.1; // Reduziere das Gewicht um 90%
        });

        // Berechne die Gewichtungsfaktoren für jede Seltenheitsstufe
        const rarityFactors = rarityWeights.map(weight => weight * rarityFactor);

        // Berechne die Gesamtzahl an Zahlen für alle Seltenheitsstufen
        const totalNumbers = rarityFactors.reduce((sum, factor) => sum + factor);

        // Wähle eine Zufallszahl basierend auf den Seltenheitsstufen
        const randomValue = Math.floor(Math.random() * totalNumbers) + 1;

        // Bestimme die Seltenheitsstufe, zu der die Zufallszahl gehört
        let rarityLevel = 0;
        let raritySum = 0;
        for (const factor of rarityFactors) {
            raritySum += factor;
            if (randomValue <= raritySum) {
                break;
            }
            rarityLevel++;
        }

        // Berechne den Wert innerhalb der Seltenheitsstufe
        const rarityMax = rarityLevel * rarityFactor;
        const rarityMin = rarityMax - rarityFactor + 1;
        const rarityRange = rarityMax - rarityMin + 1;
        const valueInRarityRange = Math.floor(Math.random() * rarityRange) + rarityMin;

        return Math.max(1, Math.abs(valueInRarityRange));
    }

    customHandler = async (message, parts, context, origin = 'twitch', channel = null, messageObject = null) => {
        let amount = this.randomInt(0, 100);
        if(parts.length > 2) {
            amount = Math.min(100, parseInt(parts[2]));
        }
        if(!amount || isNaN(amount)) {
            amount = this.randomInt(0, 100);
        }

        let self = this;
        try {
            wss.clients.forEach(function(client) {
                client.send(JSON.stringify({item: self.ensureValidHexNumber(parts[1]), amount: amount}));
            });
        } catch(err) {
            if(parts.length >= 2 && parts[1].toLowerCase().startsWith('jeremy')) {
                try {
                    wss.clients.forEach(function(client) {
                        client.send(JSON.stringify({item: 'jeremy', amount: amount}));
                    });
                } catch(err) {
                    console.log(err);
                }
            } else {
                let response = await openAiClient.getCustomChatGPTResponse(`
                Folgende Liste von möglichen Antworten gibt es.
                Sollte kein Wort oder mehrere Worte passen, wähle zufällig eines aus der Liste.
                NUR Antworten aus der Liste, die ich dir übergebe, sind erlaubt. Wähle notfalls etwas zufälliges aus.
                Antworte NUR mit dem Wort, das du gewählt hast und mit nichts anderem.
                Die Liste der einzig zugelassenen Worte: Nahrung, Trank, Rüstung, Waffe, Monster, Gegner, Tier
            `, message, 'default', '', false);

                console.log(response);

                let listOfChoices = '';
                let finalList;
                if(response.startsWith('Nahrung')) {
                    listOfChoices = this.getCommaSeparatedValues(this.skyrimFoods, 'name');
                    finalList = this.skyrimFoods;
                } else if(response.startsWith('Trank')) {
                    listOfChoices = this.getCommaSeparatedValues(this.skyrimPotions, 'name');
                    finalList = this.skyrimPotions;
                } else if(response.startsWith('Rüstung')) {
                    listOfChoices = this.getCommaSeparatedValues(this.skyrimArmors, 'name');
                    finalList = this.skyrimArmors;
                } else if(response.startsWith('Waffe')) {
                    listOfChoices = this.getCommaSeparatedValues(this.skyrimWeapons, 'name');
                    finalList = this.skyrimWeapons;
                } else if(response.startsWith('Monster') || response.startsWith('Gegner') || response.startsWith('Tier')) {
                    listOfChoices = this.getCommaSeparatedValues(this.skyrimMobs, 'name');
                    finalList = this.skyrimMobs;
                    amount = Math.min(5, amount);
                }

                if(listOfChoices) {
                    let response = await openAiClient.getCustomChatGPTResponse(`
                    Folgende Liste von möglichen Antworten gibt es.
                    Sollte kein Wort oder mehrere Worte passen, wähle zufällig eines aus der Liste.
                    NUR Antworten aus der Liste, die ich dir übergebe, sind erlaubt.
                    Antworte NUR mit dem Wort, das du gewählt hast und mit nichts anderem.
                    Die Liste der zugelassenen Worte: ${listOfChoices}
                `, message, 'default', '', false);

                    console.log(response);

                    const foundItem = this.findFormIDByName(response, finalList);
                    console.log(foundItem);

                    try {
                        wss.clients.forEach(function(client) {
                            client.send(JSON.stringify({item: self.ensureValidHexNumber(foundItem), amount: amount}));
                        });
                    } catch(err) {
                        console.log(err);
                    }
                }
            }
        }
    }
}

let hypeCommand = new HypeCommand();

export default hypeCommand;
