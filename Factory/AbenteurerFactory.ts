import {DiceRoll} from "@dice-roller/rpg-dice-roller";
import AbenteurerModel, {Abenteurer} from "../Models/Abenteurer";
import KlassenHelper from "../Utils/KlassenHelper";

export class AbenteurerFactory {
    static async createAbenteurer(name: string, klasse: string, rasse: string) {
        const startwerte = Abenteurer.getStartwerteForKlasse(klasse);

        const startMana = new DiceRoll(startwerte.manaWuerfel).total;
        const startLebenspunkte = new DiceRoll(startwerte.lebenspunkteWuerfel).total;

        const newAbenteurer = new AbenteurerModel({
            name,
            klasse,
            rasse,
            ...startwerte,
            mana: startMana,
            maxMana: startMana,
            lebenspunkte: startLebenspunkte,
            maxLebenspunkte: startLebenspunkte,
            erfahrung: 0,
        });

        try {
            const savedAbenteurer = await newAbenteurer.save();
            console.log("Neuer Abenteurer erstellt:", savedAbenteurer);
            return savedAbenteurer;
        } catch (error) {
            console.error("Fehler beim Erstellen eines neuen Abenteurers:", error);
            throw error;
        }
    }

    static async findAbenteurerByName(name: string) {
        const abenteurer = await AbenteurerModel.findOne({ name }).exec();
        if (!abenteurer) {
            console.log('Kein Abenteurer mit dem Namen gefunden:', name);
            return null;
        }

        try {
            const klassenObjekt = KlassenHelper.getKlassenObjekt(abenteurer.klasse);
            return await klassenObjekt.findOne({ name }).exec();
        } catch(err) {
            console.log(err);
            return null;
        }
    }
}