import { images } from '../../assets/constants'
import '../../styles/Chat/EmptyChat.css'

const EmptyChat = () => {
  return (
    <div className='empty-chat__container'>
      <img src={images.emptyChat} alt="" />
      Select a Chat to see the conversation
    </div>
  )
}

export default EmptyChat