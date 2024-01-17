import React from "react";

//export const API = 'http://localhost:3000/api'
//export const API = 'https://in-touch-io.onrender.com/api'
export const API = "https://in-touch-io.vercel.app/api";

export const AccessChat = async (token = '', id = '') => {

    if (token.length === 0) {
        return
    }

    const response = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ friendId: id })
    })

    const chat = await response.json();
    return chat;
}

export const loadingParams = [
    { width: '300px', height: '30px', owner: true },
    { width: '250px', height: '80px', owner: true },
    { width: '250px', height: '30px', owner: false },
    { width: '200px', height: '50px', owner: false },
    { width: '310px', height: '100px', owner: false },
    { width: '300px', height: '30px', owner: true },
    { width: '250px', height: '80px', owner: true },
    { width: '250px', height: '30px', owner: false },
    { width: '300px', height: '30px', owner: true },
    { width: '250px', height: '80px', owner: true },
]

export const checkLocalStorage = () => {
    if (!localStorage.getItem('token') || !localStorage.getItem('idInTouch')) return false
    return true
}

export const updateUnseenMessages = (idUnseenMessages: string[], setIdUnseenMessages: React.Dispatch<React.SetStateAction<string[]>>, token: string) => {
    fetch(`${API}/message/unseen`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ unseenMessages: idUnseenMessages })
    }).then(() => setIdUnseenMessages([]))
}