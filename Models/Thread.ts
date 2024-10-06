import mongoose, { Schema, Document } from 'mongoose';
import { Assistant } from './Assistant';

export interface Thread extends Document {
    openaiThreadId: string; // ID des Threads in OpenAI
    assistant: mongoose.Types.ObjectId | Assistant;
    threadIdentifier: string; // Eindeutiger Bezeichner für den Thread
    createdAt: Date;
    updatedAt: Date;
}

const ThreadSchema: Schema = new Schema({
    openaiThreadId: { type: String, required: true },
    assistant: { type: Schema.Types.ObjectId, ref: 'Assistant', required: true },
    threadIdentifier: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Sicherstellen, dass der threadIdentifier pro Assistant einzigartig ist
ThreadSchema.index({ assistant: 1, threadIdentifier: 1 }, { unique: true });

export const ThreadModel = mongoose.model<Thread>('Thread', ThreadSchema);