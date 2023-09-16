import { useContext } from 'react'
import { chatContext, generalContext, messagesContext } from '../App'
import { API } from '../assets/constants'
import '../styles/ChatCard.css'
import Contact from './Contact'

interface ChatCard_props {
    picture: string,
    name: string,
    chatId: string,
    lastMessage: string,
    unseen: {_id: string, chat: string, sender: string}[],
    hour: string,
    senderId: string,
}

const ChatCard = ({picture, name, chatId, lastMessage, unseen, hour, senderId}: ChatCard_props) => {

    const { setChatData, setChats } = useContext(chatContext)
    const { setMessages } = useContext(messagesContext)
    const { setOpenChat, socket } = useContext(generalContext)
    const userId = JSON.parse(localStorage.getItem('idInTouch') || "");
    const isOwner = userId === senderId
    
    const retrieveChatData = async() => {
        if(!socket) return
        // Se limpia de forma local el número de mensajes no vistos al abrir el chat.
        setChats(prevChats => {
          const chat = {...prevChats[chatId]}
          const updatedChat = {...chat, unseen: []}
          return { ...prevChats, [chatId]: updatedChat }
        })
        setMessages([{   
            sender: {
              _id: '',
              image: '',
              name: ''
            },
            chat: {
              _id: '',
              name: '',
              pictureUrl: ''
            },
            content: '',
            _id: '',
            createdAt: ''
          }])
        setOpenChat(true);
        setChatData({image: picture, name, id: chatId})
        const token = JSON.parse(localStorage.getItem('token') || '')
        const response = await fetch(`${API}/message/${chatId}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // Se envian los id de los mensajes no vistos para actualizarlos en base de datos.
            body: JSON.stringify({unseenMessages: unseen})
        });
        const messages = await response.json()
        setMessages(messages)
        socket.emit('join chat', chatId)
    }

  return (
    <div className='chat__card-container main__container' onClick={retrieveChatData}>
        <Contact picture={picture}/>
        <section className='chat__data'>
            <h3 className='chat__card-name'>{name}</h3>
            {isOwner && 'you: '}{lastMessage}
        </section>
        <section className='chat__extra-data'>
            <span className='chat__hour'>{hour}</span>
            {unseen.length !== 0 && <div className='new__messages-number'>{unseen.length}</div>}
        </section>
    </div>
  )
}

export default ChatCard