import { Chat, ObjectChat } from "../../domain/entities/chat.entity";
import { MessageObjectDb, PartialMessageDb } from "../../domain/entities/message.entity";
import { ChatDb, ChatsDBResponse } from "../interfaces/chat-db.response";


export class ChatMapper {
    static toEntity(chat: ChatDb, unseenMessages: PartialMessageDb[]): Chat {
        return {
            id: chat.id,
            users: chat.users,
            lastMessage: chat.lastMessage,
            updatedAt: chat.updatedAt,
            unseenMessages: unseenMessages
        }
    }

    static toEntityFromDb(response: ChatsDBResponse): Chat[] {
        const { chats, unseenMessages } = response;

        const chatEntities = chats.map((chat) => {
            const { id } = chat;
            const chatUnseenMessages = unseenMessages[id] || [];

            return this.toEntity(chat, chatUnseenMessages);
        })

        return chatEntities;
    }

    static toObject(chats: Chat[]): ObjectChat {
        const object = chats.reduce((acc, chat) => {
            const id = chat.id;
            return {
                ...acc,
                [id]: chat,
            }
        }, {})

        return object;
    }
}