import { useContext } from 'react'
import { chatContext } from '../App'
import { API } from '../assets/constants'
import '../styles/ChatCard.css'
import Contact from './Contact'

interface ChatCard_props {
    picture: string,
    name: string,
    chatId: string,
    lastMessage: string
}

const ChatCard = ({picture, name, chatId, lastMessage}: ChatCard_props) => {

    const { setOpenChat, setChatData, socket, setMessages } = useContext(chatContext)

    const retrieveChatData = async() => {
        if(!socket) return
        setOpenChat(true);
        setChatData({image: picture, name, id: chatId})
        const token = JSON.parse(localStorage.getItem('token') || '')
        const response = await fetch(`${API}/message/${chatId}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const {messages} = await response.json()
        setMessages(messages)
        socket.emit('join chat', chatId)
    }

  return (
    <div className='chat__card-container main__container' onClick={retrieveChatData}>
        <Contact picture={picture}/>
        <section className='chat__data'>
            <h3 className='chat__card-name'>{name}</h3>
            {lastMessage}
        </section>
        <section className='chat__extra-data'>
            <span className='chat__hour'>12:21</span>
            <div className='new__messages-number'>2</div>
        </section>
    </div>
  )
}

export default ChatCard