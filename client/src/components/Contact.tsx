import '../styles/Contact.css'

const Contact = ({picture = '', name = ''}) => {
  return (
    <div className="contact">
        <img className='contact__picture' src={picture} alt="contact-picture" />
        {name.length !== 0 && <div className="contact__name">{name}</div>}
    </div>
  )
}

export default Contact