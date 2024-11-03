import { Message, PartialMessage } from "./message.entity";
import { User } from "./user.entity";

export interface Chat {
    id: string,
    users: User[],
    lastMessage: Message | null,
    unseenMessages: PartialMessage[],
    updatedAt: Date
}



export interface ObjectChat {
    [key: string]: Chat
}
