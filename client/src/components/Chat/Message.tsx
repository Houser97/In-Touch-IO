import '../../styles/Chat/Message.css'

const Message = ({message = '', hour = '', owner = false, content = ''}) => {
  return (
    <div className={`message__container main__container ${owner ? 'right' : 'left'}`}>
        {content}
        <div className="message__hour">{hour}</div>
    </div>
  )
}

export default Message