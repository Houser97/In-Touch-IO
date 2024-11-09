import { Message } from "../../domain/entities/message.entity";
import { MessageDB } from "../interfaces/message-db.response";

export class MessageMapper {
    static toEntity(message: MessageDB): Message {
        return {
            id: message.id,
            sender: message.sender,
            content: message.content,
            chat: message.chat,
            isSeen: message.isSeen,
            image: message.image,
            createdAt: message.createdAt
        }
    }
}