import { Chat } from "../entities/chat.entity";

export abstract class ChatsDatasource {
    abstract getById(id: string): Promise<Chat>;
    abstract getByUserId(): Promise<Chat[]>;
    abstract create(userIds: string[]): Promise<Chat>;
    abstract update(lastMessage: string): Promise<Chat>;
}