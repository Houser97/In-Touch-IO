import '../../styles/Chat/EmptyChat.css'
import messages from '../../assets/images/Messages.png'

const EmptyChat = () => {
  return (
    <div className='empty-chat__container'>
        <img src={messages} alt="" />
        Select a Chat to see the conversation
    </div>
  )
}

export default EmptyChat