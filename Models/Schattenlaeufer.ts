import {Abenteurer} from "./Abenteurer";
import {getModelForClass} from "@typegoose/typegoose";

export class Schattenlaeufer extends Abenteurer {
    constructor() {
        super();
        this.klasse = 'Schattenläufer';
    }
}

const SchattenlaeuferModel = getModelForClass(Schattenlaeufer);
export default SchattenlaeuferModel;