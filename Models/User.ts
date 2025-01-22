import { prop, getModelForClass, modelOptions, DocumentType } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'users' } })
export class User {
    @prop({ required: true, type: String })
    public username!: string;

    @prop({ default: 'viewer', enum: ['viewer', 'moderator', 'super-moderator', 'vip'], type: String })
    public role?: string;

    @prop({ default: '', type: String })
    public pronomen?: string;

    @prop({ default: null, type: Number })
    public usernameOffenseScore?: number;

    @prop({ type: () => [AuthProvider], default: [] })
    public authProviders!: AuthProvider[];

    @prop({ type: Date })
    public loginAt?: Date;

    public static async findUserByUsername(username: string): Promise<DocumentType<User> | null> {
        try {
            return await UserModel.findOne({ username }).exec();
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }

    public static async addAuthProvider(userId: string, authProvider: AuthProvider): Promise<DocumentType<User> | null> {
        try {
            const user = await UserModel.findById(userId);
            if (user) {
                user.authProviders.push(authProvider);
                return await user.save();
            }
            return null;
        } catch (error) {
            console.error('Error adding auth provider:', error);
            throw error;
        }
    }

    public static async updateLoginAt(userId: string): Promise<DocumentType<User> | null> {
        try {
            const user = await UserModel.findById(userId);
            if (user) {
                user.loginAt = new Date();
                return await user.save();
            }
            return null;
        } catch (error) {
            console.error('Error updating login time:', error);
            throw error;
        }
    }
}

export class AuthProvider {
    @prop({ required: true, type: String })
    public providerName!: string;

    @prop({ required: true, type: String })
    public providerId!: string;

    @prop({ required: true, type: String })
    public accessToken!: string;

    @prop({ type: String })
    public refreshToken?: string;
}

const UserModel = getModelForClass(User);
export default UserModel;
