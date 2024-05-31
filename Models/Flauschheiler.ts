import {Abenteurer} from "./Abenteurer";
import {getModelForClass} from "@typegoose/typegoose";

export class Flauschheiler extends Abenteurer {
    constructor() {
        super();
        this.klasse = 'Flauschheiler';
    }
}

const FlauschheilerModel = getModelForClass(Flauschheiler);
export default FlauschheilerModel;