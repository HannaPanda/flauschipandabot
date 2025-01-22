import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

/**
 * Singleton class for managing environment variables and project paths.
 */
class Environment {
    private static instance: Environment;

    /** Absolute path to the project root */
    public readonly rootPath: string;

    /** Absolute path to the .env file */
    public readonly envPath: string;

    // Example environment variables (extend as needed)
    public readonly clientId: string;
    public readonly clientSecret: string;
    public readonly redirectUri: string;
    public readonly obsWsPass: string;
    public readonly botUsername: string;
    public readonly botPass: string;
    public readonly ownerUsername: string;
    public readonly ownerPass: string;
    public readonly channel: string;
    public readonly mongoDbConnectionString: string;
    public readonly botDiscordClientToken: string;
    public readonly discordGuildId: string;
    public readonly openAiApiKey: string;
    public readonly eventSubSecret: string;
    public readonly sessionSecret: string;
    public readonly dreamTalkingUrl: string;
    public readonly dreamTalkingReplaceName: string;
    public readonly dreamTalkingReplaceWith: string;
    public readonly cacheTtl: number;
    public readonly twitchClientId: string;
    public readonly twitchClientSecret: string;
    public readonly twitchRedirectUri: string;
    public readonly discordClientId: string;
    public readonly discordClientSecret: string;
    public readonly discordRedirectUri: string;
    public readonly googleClientId: string;
    public readonly googleClientSecret: string;
    public readonly googleRedirectUri: string;
    public readonly notionClientId: string;
    public readonly notionClientSecret: string;
    public readonly notionRedirectUri: string;
    public readonly telegramBotUsername: string;
    public readonly telegramRedirectUri: string;
    public readonly loaderApiKey: string;
    public readonly megaEmail: string;
    public readonly megaPassword: string;

    /**
     * Private constructor to enforce the Singleton pattern.
     * Initializes environment variables and dynamically detects the project root.
     */
    private constructor() {
        this.rootPath = this.findProjectRoot();
        this.envPath = path.join(this.rootPath, ".env");

        // Load .env file
        dotenv.config({ path: this.envPath });

        // Load environment variables with fallback values
        this.clientId = process.env.CLIENT_ID || "";
        this.clientSecret = process.env.CLIENT_SECRET || "";
        this.redirectUri = process.env.REDIRECT_URI || "";
        this.obsWsPass = process.env.OBS_WS_PASS || "";
        this.botUsername = process.env.BOT_USERNAME || "";
        this.botPass = process.env.BOT_PASS || "";
        this.ownerUsername = process.env.OWNER_USERNAME || "";
        this.ownerPass = process.env.OWNER_PASS || "";
        this.channel = process.env.CHANNEL || "";
        this.mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING || "";
        this.botDiscordClientToken = process.env.BOT_DISCORD_CLIENT_TOKEN || "";
        this.discordGuildId = process.env.DISCORD_GUILD_ID || "";
        this.openAiApiKey = process.env.OPENAI_API_KEY || "";
        this.eventSubSecret = process.env.EVENTSUB_SECRET || "";
        this.sessionSecret = process.env.SESSION_SECRET || "";
        this.dreamTalkingUrl = process.env.DREAMTALKING_URL || "";
        this.dreamTalkingReplaceName = process.env.DREAMTALKING_REPLACE_NAME || "";
        this.dreamTalkingReplaceWith = process.env.DREAMTALKING_REPLACE_WITH || "";
        this.cacheTtl = Number(process.env.CACHE_TTL) || 0;
        this.twitchClientId = process.env.TWITCH_CLIENT_ID || "";
        this.twitchClientSecret = process.env.TWITCH_CLIENT_SECRET || "";
        this.twitchRedirectUri = process.env.TWITCH_REDIRECT_URI || "";
        this.discordClientId = process.env.DISCORD_CLIENT_ID || "";
        this.discordClientSecret = process.env.DISCORD_CLIENT_SECRET || "";
        this.discordRedirectUri = process.env.DISCORD_REDIRECT_URI || "";
        this.googleClientId = process.env.GOOGLE_CLIENT_ID || "";
        this.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
        this.googleRedirectUri = process.env.GOOGLE_REDIRECT_URI || "";
        this.notionClientId = process.env.NOTION_CLIENT_ID || "";
        this.notionClientSecret = process.env.NOTION_CLIENT_SECRET || "";
        this.notionRedirectUri = process.env.NOTION_REDIRECT_URI || "";
        this.telegramBotUsername = process.env.TELEGRAM_BOT_USERNAME || "";
        this.telegramRedirectUri = process.env.TELEGRAM_REDIRECT_URI || "";
        this.loaderApiKey = process.env.LOADER_API_KEY || "";
        this.megaEmail = process.env.MEGA_EMAIL || "";
        this.megaPassword = process.env.MEGA_PASSWORD || "";
    }

    /**
     * Recursively finds the project root by looking for "package.json".
     * Starts from the current directory and moves up until the file is found.
     *
     * @param {string} fileName - The file to look for (default: "package.json").
     * @returns {string} Absolute path to the root directory.
     */
    private findProjectRoot(fileName: string = "package.json"): string {
        let currentDir = __dirname;

        while (!fs.existsSync(path.join(currentDir, fileName))) {
            const parentDir = path.resolve(currentDir, "..");

            if (parentDir === currentDir) {
                throw new Error(`Could not find ${fileName} in any parent directory.`);
            }

            currentDir = parentDir;
        }

        return currentDir;
    }

    /**
     * Returns the Singleton instance of the Environment class.
     * Ensures that only one instance is created and shared across the application.
     *
     * @returns {Environment} Singleton instance.
     */
    public static getInstance(): Environment {
        if (!Environment.instance) {
            Environment.instance = new Environment();
        }
        return Environment.instance;
    }

    /**
     * Returns the absolute path to the project root or a specified subdirectory.
     * Automatically constructs the correct path based on the root directory.
     *
     * @param {string} [subDir] - Optional subdirectory relative to the root path.
     * @returns {string} Absolute path to the root or the specified subdirectory.
     *
     * @example
     * console.log(Env.getPath()); // Returns root path
     * console.log(Env.getPath("public")); // Returns absolute path to /public
     * console.log(Env.getPath("public/audio")); // Returns absolute path to /public/audio
     */
    public getPath(subDir?: string): string {
        return subDir ? path.join(this.rootPath, subDir) : this.rootPath;
    }
}

// Export the Singleton instance for use throughout the project
export const Env = Environment.getInstance();
