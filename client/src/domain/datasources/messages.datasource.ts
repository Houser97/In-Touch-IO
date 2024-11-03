import { Message, MessagesData } from "../entities/message.entity";

export abstract class MessagesDatasource {
    abstract sendMessage(sender: string, content: string, chat: string, image: string): Promise<Message>;
    abstract getMessages(chatId: string, page?: number, limit?: number): Promise<MessagesData>;
    abstract updateMessageSeenStatus(ids: string[]): Promise<void>;
}