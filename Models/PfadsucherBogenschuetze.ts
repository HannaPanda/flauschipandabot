import {Abenteurer} from "./Abenteurer";
import {getModelForClass} from "@typegoose/typegoose";

export class PfadsucherBogenschuetze extends Abenteurer {
    constructor() {
        super();
        this.klasse = 'Pfadsucher-Bogenschütze';
    }
}

const PfadsucherBogenschuetzeModel = getModelForClass(PfadsucherBogenschuetze);
export default PfadsucherBogenschuetzeModel;