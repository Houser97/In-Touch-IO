import { MessageDb, MessageObjectDb } from "../../domain/entities/message.entity";
import { UserDb } from "./user-db.repository";

export interface ChatDBResponse {
    chats: ChatDb;
    unseenMessages: MessageDb[];
}

export interface ChatsDBResponse {
    chats: ChatDb[];
    unseenMessages: MessageObjectDb;
}

export interface ChatDb {
    id: string;
    users: UserDb[];
    lastMessage: MessageDb;
    updatedAt: Date;
}


