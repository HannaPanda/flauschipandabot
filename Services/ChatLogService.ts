import {ChatLogModel, IChatLog} from "../Models/ChatLog";

class ChatLogService {
    // Save chat log to MongoDB using Mongoose
    public async saveChatLog(message: string, source: string, userName: string, displayName: string, dateTime: Date): Promise<IChatLog> {
        const chatLog = new ChatLogModel({
            message,
            source,
            userName,
            displayName,
            dateTime
        });

        try {
            const result = await chatLog.save();
            console.log("Chat log saved with Mongoose:", result._id);
            return result;
        } catch (err) {
            console.error("Error saving chat log with Mongoose:", err);
            throw err;
        }
    }

    // TODO: pagination
    public async getAllChatLogs() {
        return await ChatLogModel.find().sort({ dateTime: -1 }).exec();
    }
}

export const chatLogService = new ChatLogService();
