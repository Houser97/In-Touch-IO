import { ChatsDatasource } from "../../domain/datasources/chats.datasource";
import { Chat } from "../../domain/entities/chat.entity";
import { ChatRepository } from "../../domain/repositories/chats.repository"

export class ChatRepositoryImpl extends ChatRepository {

    constructor(
        private readonly datasource: ChatsDatasource
    ) {
        super()
    }

    getById(id: string): Promise<Chat> {
        return this.datasource.getById(id);
    }
    getByUserId(): Promise<Chat[]> {
        return this.datasource.getByUserId();
    }
    create(userIds: string[]): Promise<Chat> {
        return this.datasource.create(userIds);
    }
    update(lastMessage: string): Promise<Chat> {
        return this.datasource.update(lastMessage);
    }

}