import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import '../../styles/Chat/Chat.css'
import Header from './Header'
import { DateTime } from 'luxon';
import Loading from '../ui/loaders/Loading'
import ImagePreview from './ImagePreview'
import EmptyChat from './EmptyChat'
import { AuthContext } from '../../providers/AuthProvider'
import { ChatContext } from '../../providers/ChatProvider'
import { MessageContext } from '../../providers/MessageProvider'
import InfiniteScroll from 'react-infinite-scroll-component'
import SearchLoader from '../ui/loaders/SearchLoader'
import MessageInput from './messages/MessageInput';
import Message from './messages/Message';

const loadingParams = [
  { width: '300px', height: '30px', owner: true },
  { width: '250px', height: '80px', owner: true },
  { width: '250px', height: '30px', owner: false },
  { width: '200px', height: '50px', owner: false },
  { width: '310px', height: '100px', owner: false },
  { width: '300px', height: '30px', owner: true },
  { width: '250px', height: '80px', owner: true },
  { width: '250px', height: '30px', owner: false },
  { width: '300px', height: '30px', owner: true },
  { width: '250px', height: '80px', owner: true },
]


const Chat = () => {

  const { chat } = useContext(ChatContext);
  const { messages, isLoading, hasMoreMessages, getMessagesPagination } = useContext(MessageContext);
  const { auth } = useContext(AuthContext);

  const userId = auth.user.id;
  const friendsData = chat.users.filter(user => user.id != userId)[0];

  const isEmpty = chat.users.length == 0 || chat.id === '';

  const [fileInputState, setFileInputState] = useState('');
  const [previewSource, setPreviewSource] = useState('');
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
  const [page, setPage] = useState(2);

  useEffect(() => {
    setPage(2);
  }, [chat.id]);
  

  const LoadingSection = useMemo(() => () => (
    loadingParams.map((params, index) => (
      <Loading {...params} key={index} />
    ))
  ), []);

  const messagesSection = useCallback(() => (
    <div className='messages' id='messages'>
      <InfiniteScroll
        dataLength={messages.length}
        next={() => getMessagesPagination(chat.id, page, setPage)}
        style={{ display: 'flex', flexDirection: 'column-reverse', overflow: 'hidden' }} //To put endMessage and loader to the top.
        inverse={true} //
        hasMore={hasMoreMessages}
        loader={<h4><SearchLoader></SearchLoader></h4>}
        scrollableTarget="messages"
      >
        {messages.length ? (
          messages.map(({ id, image, content, sender, createdAt }) => {
            const formattedTime = DateTime.fromISO(createdAt.toString()).toLocaleString(DateTime.TIME_SIMPLE);
            return (
              <Message
                owner={userId === sender}
                hour={formattedTime}
                content={content}
                key={id}
                image={image}
              />
            );
          })
        ) : (
          ''
        )}
      </InfiniteScroll>
    </div>

  ), [messages, userId]);

  const MessageInputProps = { fileInputState, previewSource, selectedFile, setFileInputState, setPreviewSource, setSelectedFile, chatId: chat.id }

  return (
    <div className={`chat__container ${chat.id != '' && 'show-chat'}`}>
      {isEmpty ? <EmptyChat />
        : <>
          <Header friendsData={friendsData} />
          <ImagePreview previewSource={previewSource} setPreviewSource={setPreviewSource} setSelectedFile={setSelectedFile} setFileInputState={setFileInputState} />
          {isLoading ? <div className='loading__container'>{LoadingSection()}</div> : messagesSection()}
          <MessageInput {...MessageInputProps} />
        </>}
    </div>
  )
}

export default Chat