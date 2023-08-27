import { useContext } from 'react'
import { chatContext } from '../App'
import { API } from '../assets/constants'
import '../styles/ChatCard.css'
import Contact from './Contact'

interface ChatCard_props {
    picture: string,
    name: string,
    chatId: string,
}

interface User {
    _id: string,
    name: string
}

const ChatCard = ({picture, name, chatId}: ChatCard_props) => {

    const { setOpenChat, setChatData, socket, setMessages } = useContext(chatContext)

    const userId = JSON.parse(localStorage.getItem('idInTouch') || "");

    const retrieveChatData = async() => {
        const token = JSON.parse(localStorage.getItem('token') || '')
        const response = await fetch(`${API}/message/${chatId}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const {chat, messages} = await response.json()
        const friendData = chat.users.filter((user: User) => user._id !== userId)
        const {name} = friendData[0]
        setChatData({image: picture, name, id: chatId})
        setMessages(messages)
        setOpenChat(true);
        socket.emit('join chat', chatId)
    }

  return (
    <div className='chat__card-container main__container' onClick={retrieveChatData}>
        <Contact picture={picture}/>
        <section className='chat__data'>
            <h3 className='chat__card-name'>{name}</h3>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, harum? Nesciunt quasi facere expedita quisquam assumenda aliquid nostrum dolorum cumque est cum officia perferendis sint vel odio, sed doloremque adipisci!
        </section>
        <section className='chat__extra-data'>
            <span className='chat__hour'>12:21</span>
            <div className='new__messages-number'>2</div>
        </section>
    </div>
  )
}

export default ChatCard