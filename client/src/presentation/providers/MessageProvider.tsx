
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
import { Message } from "../../domain/entities/message.entity";
import { MessageMapper } from "../../infrastructure/mappers/message.mapper";
import { ChatContext } from "./ChatProvider";
import { messageRepositoryProvider } from "./repositories/message-repository.provider";
import { ChatMapper } from "../../infrastructure/mappers/chat.mapper";
import { AuthContext } from "./AuthProvider";
import { CustomError } from "../../infrastructure/errors/custom.error";
import { SocketContext } from "./SocketProvider";

interface MessageContextProps {
    messages: Message[];
    idUnseenMessages: string[];
    isLoading: boolean;
    hasMoreMessages: boolean;
    sendMessage: (sender: string, content: string, image: string) => void;
    setIdUnseenMessages: Dispatch<SetStateAction<string[]>>;
    setMessages: Dispatch<SetStateAction<Message[]>>;
    setHasMoreMessages: Dispatch<SetStateAction<boolean>>;
    getMessages: (chatId: string) => void;
    updateMessagesStatus: (ids: string[]) => void;
    getMessagesPagination: (chatId: string) => void;
}


export const MessageContext = createContext<MessageContextProps>({
    messages: [],
    idUnseenMessages: [],
    isLoading: true,
    hasMoreMessages: false,
    sendMessage: () => { throw new Error('sendMessage not implemented') },
    setHasMoreMessages: () => { throw new Error('setHasMoreMessages not implemented') },
    setIdUnseenMessages: () => { throw new Error('setIdUnseenMessages not implemented') },
    setMessages: () => { throw new Error('setMessages not implemented') },
    getMessages: () => { throw new Error('getMessages not implemented') },
    updateMessagesStatus: () => { throw new Error('updateMessagesStatus not implemented') },
    getMessagesPagination: () => { throw new Error('getMessagesPagination not implemented') },
});

const limit = 20;

export const MessageProvider = ({ children }: PropsWithChildren) => {

    const { logout } = useContext(AuthContext);
    const { connection: socket } = useContext(SocketContext);
    const { chat, setUserChats } = useContext(ChatContext);

    const [messages, setMessages] = useState<Message[]>([]);
    const [idUnseenMessages, setIdUnseenMessages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [page, setpage] = useState(2);


    useEffect(() => {
        if (!socket) return;
        
        const handleChatUpdate = (chatPayload: {
            chat: any;
            unseenMessages: any[];
        }) => {
            const { chat: updatedChat, unseenMessages } = chatPayload;
            const chatEntity = ChatMapper.toEntity(updatedChat, unseenMessages);

            setUserChats((prev) => {
                const updatedChats = { ...prev };
                delete updatedChats[chatEntity.id];
                return { [chatEntity.id]: chatEntity, ...updatedChats };
            });
        };
        socket.on('personal-message-chat', handleChatUpdate);

        return () => {
          socket.off("personal-message-chat", handleChatUpdate);
        };
    }, [socket])

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: any) => {
            const messageEntity = MessageMapper.toEntity(message);
            setMessages((prev) => [messageEntity, ...prev]);
        };

        socket.on("personal-message-local", handleNewMessage);

        return () => {
            socket.off("PersonalMessageLocal", handleNewMessage);
        };
    }, [socket])

    const sendMessage = (sender: string, content: string, image: string) => {

        const payload = {
            message: {
                sender,
                content,
                chat: chat.id,
                image
            },
            chat
        }

        socket?.invoke("PersonalMessage", payload);

    }

    const getMessagesPagination = async (chatId: string) => {

        try {
            const { messages, next } = await messageRepositoryProvider.getMessages(chatId, page, limit);
            const reversedMessage = messages.reverse()
            setHasMoreMessages(next !== null);
            setMessages(prev => [...prev, ...reversedMessage]);
            setpage(prev => prev + 1);

        } catch (error: any | CustomError) {
            console.log(error.status);
            if (error.status === 401) {
                logout();
            } else {
                console.log(error);
            }
        }
    }

    const getMessages = async (chatId: string) => {
        setIsLoading(true);
        try {
            const { messages, next } = await messageRepositoryProvider.getMessages(chatId, 1, limit);
            setHasMoreMessages(next !== null);
            setMessages(messages.reverse());
        } catch (error: any | CustomError) {
            console.log(error.status);
            if (error.status === 401) {
                logout();
            } else {
                console.log(error);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const updateMessagesStatus = async (ids: string[]) => {
        await messageRepositoryProvider.updateMessageSeenStatus(ids);
    }


    return (
        <MessageContext.Provider value={{
            messages,
            idUnseenMessages,
            isLoading,
            hasMoreMessages,

            setMessages,
            sendMessage,
            setIdUnseenMessages,
            getMessages,
            updateMessagesStatus,
            getMessagesPagination,
            setHasMoreMessages
        }}>
            {children}
        </MessageContext.Provider>
    )
}