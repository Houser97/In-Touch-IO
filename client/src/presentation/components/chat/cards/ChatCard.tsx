import { useContext } from 'react'
import '../../../styles/ChatCard.css'
import { ChatContext } from '../../../providers/ChatProvider';
import { MessageContext } from '../../../providers/MessageProvider';
import { AuthContext } from '../../../providers/AuthProvider';
import Contact from '../../ui/Contact';

interface Props {
  picture: string,
  name: string,
  chatId: string,
  lastMessage: string | boolean,
  unseen: string[],
  hour: string,
  senderId: string,
}

const ChatCard = ({ picture, name, chatId, lastMessage, unseen, hour, senderId }: Props) => {


  const { chat, leaveChat, selectChat, joinChat, clearUnseenMessages } = useContext(ChatContext)
  const { getMessages, updateMessagesStatus } = useContext(MessageContext);
  const { auth } = useContext(AuthContext);
  const isOwner = auth.user.id === senderId

  const retrieveChatData = () => {
    if (chat.id !== '') {
      leaveChat(chat.id);
    }
    getMessages(chatId);
    selectChat(chatId);
    updateMessagesStatus(unseen);
    clearUnseenMessages(chatId);
    joinChat(chatId);
  }

  const LastMessage = () => {
    if (typeof lastMessage === 'string' && lastMessage !== 'empty') {
      return (
        lastMessage.length
          ? lastMessage
          : <div><svg className='photo__msg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>image</title><path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" /></svg>Photo</div>
      )
    }

    return ''

  }

  return (
    <div className='chat__card-container main__container' onClick={retrieveChatData}>
      <Contact picture={picture} />
      <section className='chat__data'>
        <h3 className='chat__card-name'>{name}</h3>
        <div className="last-msg__container">
          {isOwner && 'you: '}{LastMessage()}
        </div>
      </section>
      <section className='chat__extra-data'>
        <span className='chat__hour'>{hour}</span>
        {unseen.length !== 0 && <div className='new__messages-number'>{unseen.length}</div>}
      </section>
    </div>
  )
}

export default ChatCard