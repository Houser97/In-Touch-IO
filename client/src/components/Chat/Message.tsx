import '../../styles/Chat/Message.css'

const Message = ({message = '', hour = '', owner = false}) => {
  return (
    <div className={`message__container main__container ${owner ? 'right' : 'left'}`}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa ipsam temporibus voluptatibus obcaecati fugit doloribus inventore nobis quod rem, reprehenderit vero aliquam deleniti unde porro nostrum. Totam quae nihil saepe?
        <div className="message__hour">{hour}</div>
    </div>
  )
}

export default Message