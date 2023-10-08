import React from "react";
import { Socket } from "socket.io-client"

export interface user_type {
    image: string,
    name: string,
    _id: string
}

interface chatData_type {
    image: string,
    name: string,
    id: string,
}

export interface chat {
    _id: string,
    name: string,
    pictureUrl: string
}

export interface chats_type {
    _id: string,
    users: chat[],
    lastMsg: message
}

export interface chat_object {
    [key: string]: any; // Esto permite cualquier tipo para las claves
    users?: user_type[];
    lastMsg?: { content: string };
}

export interface message {
    sender: user_type,
    content: string,
    _id: string,
    createdAt: string,
    chat: chat,
    image: string
}

export interface unseenMessage {
    _id: string,
    chat: string,
    sender: string
}

export interface chatContext_types {
    user: user_type,
    chatData: chatData_type,
    chats: chat_object,
    setUser: React.Dispatch<React.SetStateAction<user_type>>,
    setChatData: React.Dispatch<React.SetStateAction<chatData_type>>,
    setChats: React.Dispatch<React.SetStateAction<chat_object>>
}

export interface messagesContext_type {
    messages: message[],
    idUnseenMessages: string[],
    setIdUnseenMessages: React.Dispatch<React.SetStateAction<string[]>>,
    setMessages: React.Dispatch<React.SetStateAction<message[]>>
}

export interface generalContext_type {
    openChat: boolean,
    openSearch: boolean,
    updateChats: boolean,
    socket: null | Socket,
    isOpenForTheFirstTime: boolean,
    isDark: boolean,
    setIsDark: React.Dispatch<React.SetStateAction<boolean>>,
    setIsOpenForTheFirstTime: React.Dispatch<React.SetStateAction<boolean>>
    setUpdateChats: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenChat: React.Dispatch<React.SetStateAction<boolean>>,
}