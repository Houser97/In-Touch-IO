import { useContext } from 'react'
import { chatContext } from '../App'
import '../styles/Chat.css'
import Header from './Chat/Header'
import Message from './Chat/Message'
import MessageInput from './Chat/MessageInput'

const Chat = () => {

    const { openChat, chatData } = useContext(chatContext);
    const userId = JSON.parse(localStorage.getItem('idInTouch') || "");

  return (
    <div className={`chat__container ${openChat && 'show-chat'}`}>
        <Header />
        <div className='chat__body'>
          {chatData.messages.length ? chatData.messages.map(({sender, content, createdAt}) => {
            return(
              <Message owner={userId === sender._id} hour={createdAt} content={content} key={sender._id}/>
            )
          }) : ''}
        </div>
        <MessageInput chatId={chatData.id}/>
    </div>
  )
}

export default Chat