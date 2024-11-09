import { MessagesDatasource } from "../../domain/datasources/messages.datasource";
import { Message, MessagesData } from "../../domain/entities/message.entity";
import inTouchIoApi from "../../presentation/config/api/inTouchIoApi";
import { CustomError } from "../errors/custom.error";
import { MessageDBResponse } from "../interfaces/message-db.response";
import { MessageMapper } from "../mappers/message.mapper";

export class MessagesDbDatasource extends MessagesDatasource {
    async sendMessage(sender: string, content: string, chat: string, image: string): Promise<Message> {
        try {
            const { data } = await inTouchIoApi.post('/messages', { sender, content, chat, image });
            return MessageMapper.toEntity(data);
        } catch (error) {
            throw CustomError.formatError(error);
        }
    }

    async getMessages(chatId: string, page: number = 1, limit: number = 10): Promise<MessagesData> {
        try {
            const { data } = await inTouchIoApi.get<MessageDBResponse>(`/messages/${chatId}?page=${page}&limit=${limit}`);
            console.log(data)
            const messages = data.messages.map(MessageMapper.toEntity);
            return { messages, next: data.next }
        } catch (error) {
            throw CustomError.formatError(error);
        }
    }

    async updateMessageSeenStatus(ids: string[]): Promise<void> {
        try {
            const { data } = await inTouchIoApi.put('/messages', { messageIds: ids });
            return
        } catch (error) {
            throw CustomError.formatError(error);
        }
    }

}