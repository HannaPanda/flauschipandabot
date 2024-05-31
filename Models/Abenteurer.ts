import { prop, getModelForClass, modelOptions, DocumentType } from '@typegoose/typegoose';
import {LevelSystem} from "../Utils/LevelSystem";
import {DiceRoll} from "@dice-roller/rpg-dice-roller";
import * as fs from "fs";
import {AbenteurerFactory} from "../Factory/AbenteurerFactory";

interface Startwerte {
    manaWuerfel: string;
    lebenspunkteWuerfel: string;
    kopfwuschel: number;
    kuschelkraft: number;
    schnurrfertigkeit: number;
    flauschigkeit: number;
    schnuffelcharme: number;
    ruestungsklasse: number;
}

@modelOptions({ schemaOptions: { collection: 'abenteurer' } })
export class Abenteurer {
    static startwerte = {
        manaWuerfel: "1d8",
        lebenspunkteWuerfel: "1d8",
        kopfwuschel: 5,
        kuschelkraft: 5,
        schnurrfertigkeit: 5,
        flauschigkeit: 5,
        schnuffelcharme: 5,
        ruestungsklasse: 5
    };

    @prop({ required: true })
    public name!: string;

    @prop({ required: true, default: 1 })
    public level!: number;

    @prop({ required: true })
    public klasse!: string;

    @prop({ required: true })
    public rasse!: string;

    @prop({ required: true })
    public kopfwuschel!: number; // Intelligenz

    @prop({ required: true })
    public kuschelkraft!: number; // Stärke

    @prop({ required: true })
    public schnurrfertigkeit!: number; // Geschicklichkeit

    @prop({ required: true })
    public flauschigkeit!: number; // Ausdauer

    @prop({ required: true })
    public schnuffelcharme!: number; // Charisma

    @prop({ required: true, default: 0 })
    public erfahrung!: number;

    @prop({ required: true })
    public mana!: number;

    @prop({ required: true })
    public maxMana!: number;

    @prop({ required: true })
    public lebenspunkte!: number;

    @prop({ required: true })
    public maxLebenspunkte!: number;

    @prop({ required: true })
    public ruestungsklasse!: number;

    static levelSystem = new LevelSystem(100, 1.5);

    public async addExperience(this: DocumentType<Abenteurer>, xp: number) {
        this.erfahrung += xp;
        const newLevel = Abenteurer.levelSystem.levelForXP(this.erfahrung);
        if (newLevel > this.level) {
            this.level = newLevel;
            this.onLevelUp();
        }
        await this.save();
    }

    private onLevelUp() {
        const startwerte = Abenteurer.getStartwerteForKlasse(this.klasse);

        const manaIncrease = new DiceRoll(startwerte.manaWuerfel).total;
        this.maxMana += manaIncrease;
        this.mana += manaIncrease;

        const lebenspunkteIncrease = new DiceRoll(startwerte.lebenspunkteWuerfel).total;
        this.maxLebenspunkte += lebenspunkteIncrease;
        this.lebenspunkte += lebenspunkteIncrease;
    }

    static getStartwerteForKlasse(klassenname: string): Startwerte {
        var normalizedPath = require("path").join(__dirname, "..", "Config", "Startwerte.json");
        try {
            const data = fs.readFileSync(normalizedPath, 'utf8');
            const startwerte = JSON.parse(data);
            return startwerte[klassenname];
        } catch (err) {
            console.error('Fehler beim Laden der Startwerte:', err);
            throw err; // oder handle den Fehler angemessen
        }
    }

    static adventurerToTwitchText(adventurer: Abenteurer): string {
        return `👤${adventurer.name} | 🌟Lvl: ${adventurer.level} | 🏷️Klasse: ${adventurer.klasse} | 🐾Rasse: ${adventurer.rasse} | 🧠Kopfwuschel: ${adventurer.kopfwuschel} | 💪Kuschelkraft: ${adventurer.kuschelkraft} | 🐱Schnurrfertigkeit: ${adventurer.schnurrfertigkeit} | 🌸Flauschigkeit: ${adventurer.flauschigkeit} | 😽Schnuffelcharme: ${adventurer.schnuffelcharme} | 📚EXP: ${adventurer.erfahrung} | 🔮Mana: ${adventurer.mana}/${adventurer.maxMana} | ❤️LP: ${adventurer.lebenspunkte}/${adventurer.maxLebenspunkte} | 🛡️RK: ${adventurer.ruestungsklasse}`;
    }
}

const AbenteurerModel = getModelForClass(Abenteurer);

export default AbenteurerModel;