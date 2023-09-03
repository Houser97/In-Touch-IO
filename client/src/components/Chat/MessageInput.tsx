import { DateTime } from 'luxon';
import { FormEvent, useContext, useState } from 'react'
import { chatContext } from '../../App';
import { API } from '../../assets/constants';
import '../../styles/Chat/MessageInput.css'

const MessageInput = ({chatId = ''}) => {

  const [message, setMessage] = useState('');
  const { socket, setMessages, setChats } = useContext(chatContext)

  const sendMessage = (e:FormEvent) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('token') || '')
    fetch(`${API}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }, 
      body: JSON.stringify({content: message, chatId, isSeen: false})
    }).then(data => data.json()).then((message) => {
      if(!socket) return undefined
      socket.emit('new message', message)
      // Los mensajes se actualizan para el usuario que lo envía, los demás usuarios lo reciben por medio de socket.
      setMessages(prev => [...prev, message])
      // Se actualiza el último mensaje para mostrarlo en la lista de los chats así como la hora en la que se creó.
      setChats(prevChats  => {
        const { createdAt } = message
        const chat = {...prevChats[chatId]}
        const updatedChat = {...chat, lastMsg: message, updatedAt: createdAt}
        const updatedChats = { ...prevChats, [chatId]: updatedChat };
        return {[chatId]: updatedChat, ...updatedChats}
      })
    });
  }

  return (
    <form className='message__form' onSubmit={sendMessage}>
        <input type="text" className='message__input' name='message' onChange={(e) => setMessage(e.target.value)}/>
        <button type='submit' className='send__message'></button>
    </form>
  )
}

export default MessageInput