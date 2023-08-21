import { FormEvent, useState } from 'react'
import { API } from '../../assets/constants';
import '../../styles/Chat/MessageInput.css'

const MessageInput = ({chatId = ''}) => {

  const [message, setMessage] = useState('');

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