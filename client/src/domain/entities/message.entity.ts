export interface Message {
    id: string,
    sender: string,
    content: string,
    chat: string,
    isSeen: boolean,
    image: string,
    createdAt: Date
}

export interface MessagesData {
    messages: Message[],
    next: string | null,
}

export interface PartialMessage {
    id: string,
    sender: string,
}


export interface MessageDb {
    id: string,
    sender: string,
    content: string,
    chat: string,
    isSeen: boolean,
    image: string,
    createdAt: Date
}

export interface PartialMessageDb {
    id: string,
    sender: string
}

export interface MessageObjectDb {
    [key: string]: PartialMessageDb[]
}