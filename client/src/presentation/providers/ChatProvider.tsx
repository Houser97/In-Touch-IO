import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from "react";
import { Chat } from "../../domain/entities/chat.entity";
import { chatRepositoryProvider } from "./repositories/chat-repository.provider";
import { ChatMapper } from "../../infrastructure/mappers/chat.mapper";
import { AuthContext } from "./AuthProvider";
import { CustomError } from "../../infrastructure/errors/custom.error";
import { SocketContext } from "./SocketProvider";

interface UserChats {
    [key: string]: Chat;
}

interface ChatContextProps {
    chat: Chat;
    userChats: UserChats;
    selectChat: (chatId: string) => void;
    setUserChats: Dispatch<SetStateAction<UserChats>>;
    getUserChats: () => void;
    getUnseenMessageIds: (chat: Chat) => string[];
    clearChat: () => void;
    joinChat: (id: string, userId: string) => void;
    leaveChat: (id: string) => void;
    clearUnseenMessages: (chatId: string) => void;
    createChat: (userIds: string[]) => void;
}

const chatInitialState: Chat = {
    id: "",
    users: [],
    lastMessage: null,
    unseenMessages: [],
    updatedAt: new Date(),
}

export const ChatContext = createContext<ChatContextProps>({
    chat: chatInitialState,
    userChats: {},
    selectChat: () => { throw new Error('selectChat not implemented') },
    setUserChats: () => { throw new Error('setUserChats not implemented') },
    getUserChats: () => { throw new Error('getUserChats not implemented') },
    getUnseenMessageIds: () => { throw new Error('getUserChats not implemented') },
    clearChat: () => { throw new Error('clearChat not implemented') },
    joinChat: () => { throw new Error('joinChat not implemented') },
    leaveChat: () => { throw new Error('leaveChat not implemented') },
    clearUnseenMessages: () => { throw new Error('clearUnseenMessages not implemented') },
    createChat: () => { throw new Error('createChat not implemented') },
});

export const ChatProvider = ({ children }: PropsWithChildren) => {

    const { auth, logout } = useContext(AuthContext);
    const { connection: socket } = useContext(SocketContext);

    const [chat, setChat] = useState<Chat>(chatInitialState);
    const [userChats, setUserChats] = useState<UserChats>({});

    const joinChat = (id: string, userId: string) => {
        socket?.invoke('JoinChat', id, userId);
    }

    const leaveChat = (id: string) => {
        socket?.invoke('LeaveChat', id);
    }

    const getUserChats = async () => {
        try {
            const chats = await chatRepositoryProvider.getByUserId();
            setUserChats(ChatMapper.toObject(chats));
        } catch (error: any | CustomError) {
            if (error.status === 401) {
                logout();
            } else {
                console.log(error);
            }
        }
    }

    const createChat = async (userIds: string[]) => {
        try {
            const chat = await chatRepositoryProvider.create(userIds);
            setUserChats(prev => ({ [chat.id]: chat, ...prev }));
        } catch (error: any | CustomError) {
            if (error.status === 401) {
                logout();
            } else {
                console.log(error);
            }
        }
    }

    const getUnseenMessageIds = (chat: Chat) => {
        return chat.unseenMessages
            .filter(message => message.sender != auth.user.id)
            .map((message) => message.id);
    }

    const selectChat = (chatId: string) => {
        const chat = userChats[chatId];
        setChat(chat);
    }

    const clearChat = () => {
        setChat(prev => ({
            ...prev,
            id: ""
        }));
    }

    const clearUnseenMessages = (chatId: string) => {
        const updatedChat: Chat = { ...userChats[chatId], unseenMessages: [] }
        setUserChats(prev => ({ ...prev, [chatId]: updatedChat }))
    }

    return (
        <ChatContext.Provider value={{
            chat,
            userChats,
            selectChat,
            setUserChats,
            getUserChats,
            getUnseenMessageIds,
            clearChat,
            joinChat,
            clearUnseenMessages,
            createChat,
            leaveChat
        }}>
            {children}
        </ChatContext.Provider>
    )
}