import { useContext } from 'react'
import { chatContext } from '../App'
import '../styles/Chat.css'
import Header from './Chat/Header'
import Message from './Chat/Message'
import MessageInput from './Chat/MessageInput'

const Chat = () => {

    const { openChat, chatData } = useContext(chatContext)

  return (
    <div className={`chat__container ${openChat && 'show-chat'}`}>
        <Header />
        <div className='chat__body'>
            <Message owner={true} hour={'01:02'}/>
            <Message hour={'01:03'}/>
            <Message owner={true} hour={'01:32'}/>
            <Message owner={true} hour={'01:32'}/>
            <Message hour={'02:02'}/>
            <Message hour={'02:02'}/>
        </div>
        <MessageInput />
    </div>
  )
}

export default Chat