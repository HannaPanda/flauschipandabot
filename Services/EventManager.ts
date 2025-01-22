// Importing the EventEmitter2 library
import { EventEmitter2 } from 'eventemitter2';
import { EVENTS } from "../Types/Events";

/**
 * Interface representing user information.
 */
export interface UserInfo {
    userName: string;
    displayName: string;
    mod: boolean;
    vip: boolean;
    owner: boolean;
}

/**
 * Interface representing a chat message event.
 */
export interface ChatMessageEvent {
    message: string;
    tokens: string[];
    user: UserInfo;
    platform: 'twitch' | 'discord';
    channel: any;
    rawMessage: any;
}

/**
 * Class to manage events using EventEmitter2.
 */
class EventManager {
    private emitter: EventEmitter2;

    /**
     * Initializes a new instance of EventManager with EventEmitter2.
     */
    constructor() {
        this.emitter = new EventEmitter2({
            wildcard: true,
            delimiter: '.',
            maxListeners: 100,
            verboseMemoryLeak: true,
        });
    }

    /**
     * Emits a chat message event.
     * @param {ChatMessageEvent} event - The chat message event data.
     */
    emitChatMessage(event: ChatMessageEvent) {
        this.emitter.emit(EVENTS.CHAT_MESSAGE_V2, event);
    }

    /**
     * Registers a listener for chat message events.
     * @param {(event: ChatMessageEvent) => void} listener - The callback function to be executed when a chat message event occurs.
     */
    onChatMessage(listener: (event: ChatMessageEvent) => void) {
        this.emitter.on(EVENTS.CHAT_MESSAGE_V2, listener);
    }

    // Additional utility methods can be added here for other event types
}

/**
 * Singleton instance of EventManager to be used across the application.
 */
export const eventManager = new EventManager();
