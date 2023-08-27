import { FormEvent, useContext, useState } from 'react'
import { chatContext } from '../../App';
import { API } from '../../assets/constants';
import '../../styles/Chat/MessageInput.css'

const MessageInput = ({chatId = ''}) => {

  const [message, setMessage] = useState('');
  const { socket, setIsNewMessage } = useContext(chatContext)

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
      socket.emit('new message', message)
      setIsNewMessage(prev => !prev)
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