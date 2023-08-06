import { useContext } from 'react'
import { chatContext } from '../App'
import '../styles/ChatCard.css'
import Contact from './Contact'

interface ChatCard_props {
    picture: string,
    name: string
}

const ChatCard = ({picture, name}: ChatCard_props) => {

    const { setOpenChat, setChatData } = useContext(chatContext)

    const handleClick = () => {
        setOpenChat(true);
        setChatData({image: picture, name})
    }

  return (
    <div className='chat__card-container main__container' onClick={handleClick}>
        <Contact picture={picture}/>
        <section className='chat__data'>
            <h3 className='chat__card-name'>{name}</h3>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, harum? Nesciunt quasi facere expedita quisquam assumenda aliquid nostrum dolorum cumque est cum officia perferendis sint vel odio, sed doloremque adipisci!
        </section>
        <section className='chat__extra-data'>
            <span className='chat__hour'>12:21</span>
            <div className='new__messages-number'>2</div>
        </section>
    </div>
  )
}

export default ChatCard