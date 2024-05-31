import {getModelForClass} from "@typegoose/typegoose";
import {Abenteurer} from "./Abenteurer";

export class Bambusmagier extends Abenteurer {
    constructor() {
        super();
        this.klasse = 'Bambusmagier';
    }
}

const BambusMagierModel = getModelForClass(Bambusmagier);
export default BambusMagierModel;