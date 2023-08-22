interface image_type {
    url: string,
    publicId: string,
}

interface user_type {
    image: image_type,
    name: string,
    id: string
}

interface messages {
    senderId: string,
    senderName: string,
    senderImage: string,
    content: string,
    id: string
}

interface chatData_type {
    image: string,
    name: string,
    id: string,
    messages: messages[]
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
