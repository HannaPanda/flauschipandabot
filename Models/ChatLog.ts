import { Schema, model, Document } from "mongoose";

export interface IChatLog extends Document {
    message: string;
    source: string;
    userName: string;
    displayName: string;
    dateTime: Date;
}

const chatLogSchema = new Schema<IChatLog>({
    message: { type: String, required: true },
    source: { type: String, required: true },
    userName: { type: String, required: true },
    displayName: { type: String, required: true },
    dateTime: { type: Date, required: true }
});

export const ChatLogModel = model<IChatLog>("ChatLog", chatLogSchema);
