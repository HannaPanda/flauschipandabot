import mongoose, { Schema, Document } from 'mongoose';

export interface Assistant extends Document {
    openaiAssistantId: string;
    name: string;
    description?: string;
}

const AssistantSchema: Schema = new Schema({
    openaiAssistantId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
});

export const AssistantModel = mongoose.model<Assistant>('Assistant', AssistantSchema);