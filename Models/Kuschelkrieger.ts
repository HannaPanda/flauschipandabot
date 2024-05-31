import {Abenteurer} from "./Abenteurer";
import {getModelForClass} from "@typegoose/typegoose";

export class Kuschelkrieger extends Abenteurer {
    constructor() {
        super();
        this.klasse = 'Kuschelkrieger';
    }
}

const KuschelkriegerModel = getModelForClass(Kuschelkrieger);
export default KuschelkriegerModel;