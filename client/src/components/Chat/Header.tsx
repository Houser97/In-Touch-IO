import { useContext } from 'react'
import { chatContext } from '../../App'
import { API } from '../../assets/constants'
import '../../styles/Chat/Header.css'
import Contact from '../Contact'

const Header = () => {

    const { chatData, setOpenChat, setChatData, idUnseenMessages, setIdUnseenMessages } = useContext(chatContext)

    const clearChat = () => {
      const token = JSON.parse(localStorage.getItem('token') || "");
      setOpenChat(false)
      setChatData(prevData => {return{...prevData, id: ''}})
      fetch(`${API}/message/update_messages_to_seen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({unseenMessages: idUnseenMessages})
      }).then(() => setIdUnseenMessages([]))
    }

  return (
    <header className='header__chat'>
        <svg onClick={clearChat} className='arrow-left' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
        <Contact picture={chatData.image} name={chatData.name} />
    </header>
  )
}

export default Header