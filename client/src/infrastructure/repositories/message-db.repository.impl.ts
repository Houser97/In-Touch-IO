import { MessagesDatasource } from "../../domain/datasources/messages.datasource";
import { Message, MessagesData } from "../../domain/entities/message.entity";
import { MessagesRepository } from "../../domain/repositories/messages.repository";

export class MessageRepositoryImpl extends MessagesRepository {

    constructor(
        private datasource: MessagesDatasource
    ) {
        super()
    }

    async sendMessage(sender: string, content: string, chat: string, image: string): Promise<Message> {
        return this.datasource.sendMessage(sender, content, chat, image);
    }

    async getMessages(chatId: string, page: number = 1, limit: number = 10): Promise<MessagesData> {
        return this.datasource.getMessages(chatId, page, limit);
    }

    async updateMessageSeenStatus(ids: string[]): Promise<void> {
        return this.datasource.updateMessageSeenStatus(ids);
    }

}