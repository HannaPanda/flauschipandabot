import { Schema, model, Document } from 'mongoose';

// Interface für das GreetedUser Model, das nur den Username enthält
export interface IGreetedUser extends Document {
    username: string;
}

// Schema Definition für GreetedUser
const greetedUserSchema = new Schema<IGreetedUser>({
    username: { type: String, required: true, unique: true }
});

// Model-Export
export const GreetedUserModel = model<IGreetedUser>('GreetedUser', greetedUserSchema);
