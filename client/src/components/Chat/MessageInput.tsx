import '../../styles/Chat/MessageInput.css'

const MessageInput = () => {
  return (
    <form className='message__form'>
        <input type="text" className='message__input' name='message' />
        <button type='submit' className='send__message'></button>
    </form>
  )
}

export default MessageInput