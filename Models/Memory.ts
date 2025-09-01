import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing a memory document.
 */
export interface Memory extends Document {
    channel: string;
    memoryData: any; // JSON object with compressed story data
    tokens: number; // Approximate token count for the memory
    cumulative?: boolean; // Indicates if this document is the cumulative memory for the channel
    createdAt: Date;
}

const MemorySchema: Schema = new Schema({
    channel: { type: String, required: true },
    memoryData: { type: Schema.Types.Mixed, required: true },
    tokens: { type: Number, required: true },
    cumulative: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const MemoryModel = mongoose.model<Memory>('Memory', MemorySchema);
