import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { generalContext } from '../App'
import { AccessChat, checkLocalStorage } from '../assets/constants'
import '../styles/Contact.css'

const Contact = ({picture = '', name = '', id = '', added = false}) => {

  const { setUpdateChats } = useContext(generalContext)
  const navigate = useNavigate()

  const handleClick = async() => {
    if(!checkLocalStorage()) {
      navigate('/')
      return undefined
    }
    const token = JSON.parse(localStorage.getItem('token') || '');
    const userId = JSON.parse(localStorage.getItem('idInTouch') || "");
    if(userId === id) return
    const chat = await AccessChat(token, id)
    setUpdateChats(prev => !prev)
  }

  return (
    <div className="contact" onClick={handleClick}>
        <svg className={`tick ${added && 'show-added'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check-circle</title><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg>
        <img className='contact__picture' src={picture} alt="contact-picture" />
        {name.length !== 0 && <div className="contact__name">{name}</div>}
    </div>
  )
}

export default Contact