import { ChatsDatasource } from "../../domain/datasources/chats.datasource";
import { Chat } from "../../domain/entities/chat.entity";
import inTouchIoApi from "../../presentation/config/api/inTouchIoApi";
import { CustomError } from "../errors/custom.error";
import { ChatDb, ChatsDBResponse } from "../interfaces/chat-db.response";
import { ChatMapper } from "../mappers/chat.mapper";

export class ChatDbDatasource extends ChatsDatasource {
    getById(id: string): Promise<Chat> {
        throw new Error("Method not implemented.");
    }
    async getByUserId(): Promise<Chat[]> {
        try {
            const { data } = await inTouchIoApi.get<ChatsDBResponse>('/chats');
            return ChatMapper.toEntityFromDb(data);
        } catch (error) {
            throw CustomError.formatError(error);
        }
    }

    async create(userIds: string[]): Promise<Chat> {
        try {
            const { data } = await inTouchIoApi.post<ChatDb>('/chats', { users: userIds });
            return ChatMapper.toEntity(data, [{ id: '', sender: '' }]);
        } catch (error) {
            throw CustomError.formatError(error);
        }
    }

    update(lastMessage: string): Promise<Chat> {
        throw new Error("Method not implemented.");
    }

}