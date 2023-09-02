import { useContext } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { chatContext } from '../App'
import '../styles/Chat.css'
import Header from './Chat/Header'
import Message from './Chat/Message'
import MessageInput from './Chat/MessageInput'
import { DateTime } from 'luxon';
import { loadingParams } from '../assets/constants'
import Loading from './Loading'

const Chat = () => {
  
    const { openChat, messages, chatData } = useContext(chatContext);
    const userId = JSON.parse(localStorage.getItem('idInTouch') || "");
    const isLoading = messages[0].sender._id === '';

    const LoadingSection = () => 
      loadingParams.map((params, index) => {
        return(
          <Loading {...params} key={index}/>
        )
    })

    const messagesSection = () =>  
      <ScrollableFeed>
        {messages.length ? messages.map(({sender, content, createdAt, _id}) => {
          const formattedTime = DateTime.fromISO(createdAt).toLocaleString(DateTime.TIME_SIMPLE);
          return(
            <Message owner={userId === sender._id} hour={formattedTime} content={content} key={_id}/>
          )
        }) : ''}
      </ ScrollableFeed>

  return (
    <div className={`chat__container ${openChat && 'show-chat'}`}>
        <Header />
        {isLoading ? <div className='loading__container'>{LoadingSection()}</div> : messagesSection()}
        <MessageInput chatId={chatData.id}/>
    </div>
  )
}

export default Chat