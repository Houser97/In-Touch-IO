export const API = 'http://localhost:3000/api'

export const AccessChat = async(token = '', id = '') => {

    if(token.length === 0){
        return
    }

    const response = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({friendId: id})
    })

    const chat = await response.json();
    return chat;
}