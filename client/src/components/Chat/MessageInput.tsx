import { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { chatContext, generalContext, messagesContext } from '../../App';
import { API } from '../../assets/constants';
import '../../styles/Chat/MessageInput.css'

interface MsgInput_type {
  chatId: string,
  fileInputState: string,
  previewSource: string,
  selectedFile: Blob | null,
  setFileInputState:  React.Dispatch<React.SetStateAction<string>>,
  setPreviewSource: React.Dispatch<React.SetStateAction<string>>,
  setSelectedFile:  React.Dispatch<React.SetStateAction<Blob | null>>
}

const MessageInput = ({chatId = '', fileInputState = '', previewSource = '', selectedFile = null, setFileInputState, setPreviewSource, setSelectedFile}: MsgInput_type ) => {

  const [message, setMessage] = useState('');
  const { setChats } = useContext(chatContext);
  const { setMessages } = useContext(messagesContext);
  const { socket } = useContext(generalContext);
  const navigate = useNavigate()

  const handleMessageCreation = (e:FormEvent) => {
    e.preventDefault();
    if(!selectedFile && !message.length) return;
    if(selectedFile){
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        sendMessage(reader.result);
      }
      reader.onerror = () => {
          console.log('Error')
      }
    } else {
      sendMessage('');
    }
    
  }

const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files && target.files[0]
    if(!file) return;
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(target.value);
}

const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        setPreviewSource(reader.result as string);
    }
}

  const sendMessage = (image: string | ArrayBuffer | null) => {
    setMessage('');
    setPreviewSource('');
    setSelectedFile(null);
    setFileInputState('');
    const token = JSON.parse(localStorage.getItem('token') || '')
    fetch(`${API}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }, 
      body: JSON.stringify({content: message, chatId, isSeen: false, image})
    }).then(data => data.json()).then((message) => {
      if(!socket) return undefined
      if(!message) {
        navigate('/')
        return
      }
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
    <form className='message__form' onSubmit={handleMessageCreation}>
        <label className="message__img-label" htmlFor="file">
            <svg viewBox="0 0 24 24" className='image_svg'><title>image-area</title><path d="M20,5A2,2 0 0,1 22,7V17A2,2 0 0,1 20,19H4C2.89,19 2,18.1 2,17V7C2,5.89 2.89,5 4,5H20M5,16H19L14.5,10L11,14.5L8.5,11.5L5,16Z" /></svg>
            <input 
              type="file" 
              id='file'
              name='image'
              onChange={(e) => handleFileInputChange(e)}
              value={fileInputState}
              className='input__image-msg'/>
        </label>
        <input type="text" className='message__input' name='message' onChange={(e) => setMessage(e.target.value)} value={message}/>
        <button type='submit' className='send__message'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>send-circle</title><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M8,7.71V11.05L15.14,12L8,12.95V16.29L18,12L8,7.71Z" /></svg>
        </button>
    </form>
  )
}

export default MessageInput