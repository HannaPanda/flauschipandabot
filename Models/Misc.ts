import { Schema, model, Document } from "mongoose";

export interface IMisc extends Document {
    identifier: string;
    value: number;
}

const miscSchema = new Schema<IMisc>({
    identifier: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 }
});

export const MiscModel = model<IMisc>("Misc", miscSchema);