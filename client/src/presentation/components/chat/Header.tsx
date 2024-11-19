import { useContext } from 'react'
import '../../styles/Chat/Header.css'
import Contact from '../ui/Contact'
import { ChatContext } from '../../providers/ChatProvider'
import { User } from '../../../domain/entities/user.entity'
import { MessageContext } from '../../providers/MessageProvider'

interface Props {
  friendsData: User | undefined
}

const Header = ({ friendsData }: Props) => {

  const { chat, clearChat, leaveChat } = useContext(ChatContext);
  const { setHasMoreMessages } = useContext(MessageContext);

  const clear = () => {
    leaveChat(chat.id);
    clearChat();
    setHasMoreMessages(true);
    // if (!idUnseenMessages.length) return;
    // updateUnseenMessages(idUnseenMessages, setIdUnseenMessages, token)
  }

  const pictureUrl = friendsData?.pictureUrl || '';
  const name = friendsData?.name || '';

  return (
    <header className='header__chat'>
      <svg onClick={clear} className='arrow-left' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
      <Contact picture={pictureUrl} name={name} />
    </header>
  )
}

export default Header