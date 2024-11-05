export interface MessageDBResponse {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    next: string | null;
    prev: string | null;
    messages: MessageDB[];
}

export interface MessageDB {
    id: string;
    sender: string;
    content: string;
    chat: string;
    isSeen: boolean;
    image: string;
    createdAt: Date;
}