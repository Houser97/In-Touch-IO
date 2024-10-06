import '../styles/Body.css'
import Chat from './Chat'
import MessagesList from './MessagesList'

const Body = () => {
  return (
    <div className='chats-msgList'>
        <MessagesList />
        <Chat />
    </div>
  )
}

export default Body