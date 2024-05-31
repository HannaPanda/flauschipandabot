import {UserModel} from "../Models/User";

class UserService {
    // Add a user with a specific role
    public async addUser(username: string, role: string) {
        const user = new UserModel({ username, role });
        await user.save();
    }

    // Update a user's role
    public async updateUserRole(username: string, role: string) {
        await UserModel.findOneAndUpdate({ username }, { role });
    }

    // Remove a user
    public async removeUser(username: string) {
        await UserModel.findOneAndDelete({ username });
    }

    // Get a user by username
    public async getUser(username: string) {
        return await UserModel.findOne({ username });
    }

    // Get all users
    public async getAllUsers() {
        return await UserModel.find().exec();
    }
}

export const userService = new UserService();