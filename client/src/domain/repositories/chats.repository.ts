import { Chat } from "../entities/chat.entity";

export abstract class ChatRepository {
    abstract getById(id: string): Promise<Chat>;
    abstract getByUserId(): Promise<Chat[]>;
    abstract create(userIds: string[]): Promise<Chat>;
    abstract update(lastMessage: string): Promise<Chat>;
}