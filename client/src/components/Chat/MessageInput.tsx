import { FormEvent, useContext, useState } from 'react'
import { chatContext } from '../../App';
import { API } from '../../assets/constants';
import '../../styles/Chat/MessageInput.css'

const MessageInput = ({chatId = ''}) => {

  const [message, setMessage] = useState('');
  const { socket, setMessages } = useContext(chatContext)

  const sendMessage = (e:FormEvent) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('token') || '')
    fetch(`${API}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }, 
      body: JSON.stringify({content: message, chatId})
    }).then(data => data.json()).then((message) => {
      if(!socket) return undefined
      socket.emit('new message', message)
      // Los mensajes se actualizan para el usuario que lo envía, los demás usuarios lo reciben por medio de socket.
      setMessages(prev => [...prev, message])
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