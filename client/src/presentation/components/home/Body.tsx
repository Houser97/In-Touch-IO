import '../../styles/Body.css'
import Chat from '../chat/Chat'
import MessagesList from '../chat/messages/MessagesList'

const Body = () => {
  return (
    <div className='chats-msgList'>
      <MessagesList />
      <Chat />
    </div>
  )
}

export default Body