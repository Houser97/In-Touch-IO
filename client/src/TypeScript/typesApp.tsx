interface user_type {
    image: string,
    name: string,
    _id: string
}

interface chatData_type {
    image: string,
    name: string,
    id: string,
}

interface chat {
    _id: string,
    name: string,
    pictureUrl: string
}

interface chats_type {
    _id: string,
    users: chat[]
}

export interface chatContext_types {
    openChat: boolean,
    user: user_type,
    chatData: chatData_type,
    chats: chats_type[],
    openSearch: boolean,
    updateChats: boolean,
    setUpdateChats: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenChat: React.Dispatch<React.SetStateAction<boolean>>,
    setUser: React.Dispatch<React.SetStateAction<user_type>>,
    setChatData: React.Dispatch<React.SetStateAction<chatData_type>>
}

export interface message {
    sender: user_type,
    content: string,
    _id: string,
    createdAt: string,
    chat: chat
}