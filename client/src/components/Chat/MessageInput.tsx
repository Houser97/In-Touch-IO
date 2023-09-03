import { FormEvent, useContext, useState } from 'react'
import { chatContext } from '../../App';
import { API } from '../../assets/constants';
import '../../styles/Chat/MessageInput.css'

const MessageInput = ({chatId = ''}) => {

  const [message, setMessage] = useState('');
  const { socket, setMessages, setChats } = useContext(chatContext)

  const sendMessage = (e:FormEvent) => {
    e.preventDefault();
    if(!message.length) return
    setMessage('')
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
        <input type="text" className='message__input' name='message' onChange={(e) => setMessage(e.target.value)} value={message}/>
        <button type='submit' className='send__message'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>send-circle</title><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M8,7.71V11.05L15.14,12L8,12.95V16.29L18,12L8,7.71Z" /></svg>
        </button>
    </form>
  )
}

export default MessageInput