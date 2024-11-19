import { useContext } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/Settings.css'
import ToggleDarkBtn from '../ui/buttons/ToggleDarkBtn'
import { AuthContext } from '../../providers/AuthProvider'
import { MessageContext } from '../../providers/MessageProvider'
import { ChatContext } from '../../providers/ChatProvider'

const Settings = () => {

  const { auth, logout } = useContext(AuthContext);
  const { setMessages } = useContext(MessageContext);
  const { setUserChats, clearChat } = useContext(ChatContext)

  const handeLogout = () => {
    clearChat();
    setMessages([]);
    setUserChats({});
    logout();
  }

  return (
    <div className='settings__container'>
      <Link className='logout__btn' to={`/settings/${auth.user.id}`}>
        <span>Settings</span>
      </Link>
      <Link className='logout__btn' to={`/`} onClick={handeLogout}>
        <span>Log Out</span>
      </Link>
      <ToggleDarkBtn />
    </div>
  )
}

export default Settings