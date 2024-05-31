import Bambusmagier from "../Models/Bambusmagier";
import Flauschheiler from "../Models/Flauschheiler";
import Schattenlaeufer from "../Models/Schattenlaeufer";
import Kuschelkrieger from "../Models/Kuschelkrieger";
import PfadsucherBogenschuetze from "../Models/PfadsucherBogenschuetze";
import {DiceRoll} from "@dice-roller/rpg-dice-roller";
import AbenteurerModel from "../Models/Abenteurer";
import {getModelForClass} from "@typegoose/typegoose";
import BambusMagierModel from "../Models/Bambusmagier";
import FlauschheilerModel from "../Models/Flauschheiler";
import SchattenlaeuferModel from "../Models/Schattenlaeufer";
import KuschelkriegerModel from "../Models/Kuschelkrieger";
import PfadsucherBogenschuetzeModel from "../Models/PfadsucherBogenschuetze";

export default class KlassenHelper {
    static KlassenMap = {
        Bambusmagier: Bambusmagier,
        Flauschheiler: Flauschheiler,
        'Schattenläufer': Schattenlaeufer,
        Kuschelkrieger: Kuschelkrieger,
        'Pfadsucher-Bogenschütze': PfadsucherBogenschuetze,
    };

    static ModelMap = {
        Bambusmagier: BambusMagierModel,
        Flauschheiler: FlauschheilerModel,
        'Schattenläufer': SchattenlaeuferModel,
        Kuschelkrieger: KuschelkriegerModel,
        'Pfadsucher-Bogenschütze': PfadsucherBogenschuetzeModel,
    };

    static getKlassenObjekt(klasse: string) {
        const klassenObjekt = KlassenHelper.KlassenMap[klasse];
        if (!klassenObjekt) {
            throw new Error(`Unbekannte Klasse: ${klasse}`);
        }
        return klassenObjekt;
    }

    static getKlassenModel(klasse: string) {
        const klassenModel = KlassenHelper.ModelMap[klasse];
        if (!klassenModel) {
            throw new Error(`Unbekannte Klasse: ${klasse}`);
        }
        return klassenModel;
    }
}