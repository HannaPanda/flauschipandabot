import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    role?: string;
    pronomen?: string;
    usernameOffenseScore?: number;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    role: { type: String, default: 'viewer', enum: ['viewer', 'moderator', 'super-moderator', 'vip'] },
    pronomen: { type: String, default: '' },
    usernameOffenseScore: { type: Number, default: null }
});

export const UserModel = model<IUser>('User', userSchema);