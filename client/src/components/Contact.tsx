import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { generalContext } from '../App'
import { AccessChat, checkLocalStorage } from '../assets/constants'
import '../styles/Contact.css'

const Contact = ({picture = '', name = '', id = ''}) => {

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
        <img className='contact__picture' src={picture} alt="contact-picture" />
        {name.length !== 0 && <div className="contact__name">{name}</div>}
    </div>
  )
}

export default Contact