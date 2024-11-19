import { useContext } from 'react'
import '../../../styles/MessagesList.css'
import { ChatContext } from '../../../providers/ChatProvider'
import { AuthContext } from '../../../providers/AuthProvider'
import { DateAdapter } from '../../../config/date/date.adapter'
import AddButton from '../../ui/buttons/AddButton'
import ChatCard from '../cards/ChatCard'
import HeaderMain from '../../ui/HeaderMain'

const MessagesList = () => {

  const { userChats, getUnseenMessageIds } = useContext(ChatContext);
  const { auth } = useContext(AuthContext);

  return (
    <section className='message__list main__container'>
      <HeaderMain />
      <AddButton text={'Add user'} />
      {Object.keys(userChats).map((key) => {
        const chat = userChats[key]
        const { id, users, lastMessage, updatedAt } = chat

        const senderId = lastMessage?.sender || '';
        const content = lastMessage ? lastMessage?.content || '' : 'empty';

        const friend = users.find((user) => user.id !== auth.user.id);
        const { name, pictureUrl } = friend!;

        const unseen = getUnseenMessageIds(chat);

        const formattedTime = DateAdapter.convertTimestamp(updatedAt.toString());
        return (
          <ChatCard key={`ChatCard-${id}`} name={name} picture={pictureUrl} chatId={id} lastMessage={content} unseen={unseen} hour={formattedTime} senderId={senderId} />
        )
      })}
    </section>
  )
}

export default MessagesList