import { useContext } from 'react'
import { chatContext } from '../../App'
import '../../styles/Chat/Header.css'
import Contact from '../Contact'

const Header = () => {

    const { chatData, setOpenChat } = useContext(chatContext)

  return (
    <header className='header__chat'>
        <svg onClick={() => setOpenChat(false)} className='arrow-left' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
        <Contact picture={chatData.image} name={chatData.name} />
    </header>
  )
}

export default Header