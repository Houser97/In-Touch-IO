import { AccessChat } from '../assets/constants'
import '../styles/Contact.css'

const Contact = ({picture = '', name = '', id = ''}) => {

  const handleClick = async() => {
    const token = JSON.parse(localStorage.getItem('token') || '');
    const userId = JSON.parse(localStorage.getItem('idInTouch') || "");
    if(userId === id) return
    const chat = await AccessChat(token, id)
    console.log(chat)
  }

  return (
    <div className="contact" onClick={handleClick}>
        <img className='contact__picture' src={picture} alt="contact-picture" />
        {name.length !== 0 && <div className="contact__name">{name}</div>}
    </div>
  )
}

export default Contact