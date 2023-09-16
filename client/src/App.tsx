import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { API } from './assets/constants'
import { useSocket } from './assets/socket'
import Chat from './components/Chat'
import ContactsCarousel from './components/ContactsCarousel'
import HeaderMain from './components/HeaderMain'
import ChatLoader from './components/Loaders/ChatLoader'
import MessagesList from './components/MessagesList'
import Search from './components/Search'
import { chat, chatContext_types, chat_object, message, unseenMessage } from './TypeScript/typesApp'

export const chatContext = createContext<chatContext_types>({
  openChat: false,
  chats: {
    users:[],
    lastMsg: {content: ''}
  },
  user: {
    image: '',
    name: '',
    _id: ''
  },
  chatData: {
    name: '',
    image: '',
    id: '',
  },
  openSearch: false,
  socket: null,
  messages: [],
  updateChats: false,
  idUnseenMessages: [],
  setIdUnseenMessages: () => [],
  setMessages: () => [],
  setUpdateChats: () => false,
  setOpenSearch: () => false,
  setOpenChat: () => false,
  setUser: () => false,
  setChatData: () => false,
  setChats: () => {},
})

function App() {

  const navigate = useNavigate();

  const socket = useSocket()
  const [chatsLoading, setChatsLoading] = useState(true)
  const [openChat, setOpenChat] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [messages, setMessages] = useState([{   
    sender: {
      _id: '',
      image: '',
      name: ''
    },
    chat: {
      _id: '',
      name: '',
      pictureUrl: ''
    },
    content: '',
    _id: '',
    createdAt: ''
  }],)
  // Estado que llama a API de chats cuando se crea un nuevo chat.
  const [updateChats, setUpdateChats] = useState(false)
  //Estado que se usa para mostrar datos del contacto al abrir el chat.
  const [chatData, setChatData] = useState({
    image: '',
    name: '',
    id: '',
  })
  const [user, setUser] = useState({
    image: '',
    name: '',
    _id: '',
  })

  const [chats, setChats] = useState({})
  // Arreglo que guarda Id de mensajes que se reciben estando en el Chat para poder cambiarlos a visto en base de datos al cerrar chat.
  const [idUnseenMessages, setIdUnseenMessages] = useState<string[]>([])

  useEffect(() => {
    if(!localStorage.getItem('token')) {
      navigate('/')
      return undefined
    }
    const token = JSON.parse(localStorage.getItem('token') || "");
    const id = JSON.parse(localStorage.getItem('idInTouch') || "");
    fetch(`${API}/user/get_user_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({id})
    })
    .then(response => response.json())
    .then(user => {
      if(!user) {
        navigate('/')
        return undefined
      }
      const { name, pictureUrl, _id } = user
      const image = pictureUrl
      // Se guarda la imagen y el nombre de usuario para poder usarlos en el componente UpdateUser
      localStorage.setItem('userData', JSON.stringify({name, pictureUrl}));
      setUser({name, image, _id})
      setTimeout(() => {
        setChatsLoading(false);
      }, 1000);
    })
  }, [])

  useEffect(() => {
    if(!localStorage.getItem('token')) {
      navigate('/')
      return undefined
    }
    const token = JSON.parse(localStorage.getItem('token') || "");
    if(!token.length) return undefined;
    fetch(`${API}/chat/getChats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const { chats, unseenMessages } = data
      if(!chats.length) return undefined
      // Se crea objeto usando los id de los chats y se agrega campo para guardar mensajes no leídos para cada chat.
      const chatsObject = chats.reduce((acc: chat_object, chat: chat) => {
        if(!acc[chat._id]){
          const messages = unseenMessages.filter((msg: unseenMessage) => msg.chat === chat._id)
          acc[chat._id] = {...chat, unseen: messages}
        }
        return acc
      }, {})
      setChats(chatsObject);
    })
  }, [updateChats])

  useEffect(() => {
    if (!socket) return; // Si el socket no está listo, no hacemos nada en este efecto
  
    const messageReceivedHandler = (newMessage: message) => {
      const messageChatId = newMessage.chat._id
      const messageId = newMessage._id
      const senderId = newMessage.sender._id
      const messageCreatedAt = newMessage.createdAt
      // Si el chat del mensaje es nuevo, entonces se recuperan todos los mensajes desde la base de datos.
      if(!(messageChatId in chats)) {
        setUpdateChats(prev => !prev)
        return;
      }
      // Si el mensaje proviene de otro chat el cual no se está seleccionado actualmente o no se tiene ningún chat
      // abierto, entonces se actualiza el último mensaje mostrado para ese chat.
      if (chatData.id !== messageChatId || chatData.id === '') {
        setChats((prevChats: chat_object)  => {
          const chat = {...prevChats[messageChatId]}
          const updatedChat = {...chat, lastMsg: newMessage, updatedAt: messageCreatedAt,unseen: [...chat['unseen'], {_id: messageId, chat: messageChatId, sender: senderId}]}
          const updatedChats = { ...prevChats, [messageChatId]: updatedChat };
          return {[messageChatId]: updatedChat, ...updatedChats}
        })
        return;
      }
      // Se actualiza el último mensaje del Chat
      setChats((prevChats: chat_object)  => {
        const chat = {...prevChats[messageChatId]}
        const updatedChat = {...chat, lastMsg: newMessage, updatedAt: messageCreatedAt}
        const updatedChats = { ...prevChats, [messageChatId]: updatedChat };
        return {[messageChatId]: updatedChat, ...updatedChats}
      })
      // Se agrega ID de mensaje en estado
      setIdUnseenMessages(prev => [...prev, messageId])
      // Se agrega el nuevo mensaje a los mensajes del chat abierto.
      setMessages(prev => [...prev, newMessage]);
    };
  
    socket.on('message received', messageReceivedHandler);
  
    return () => {
      socket.off('message received', messageReceivedHandler);
    };
    // Se debe cambiar con el id del chat, ya que de lo contrario el valor del id en la lógica no se actualiza
  }, [chatData.id, socket, Object.keys(chats).length]);
  

  const values = {
    setOpenChat, 
    openChat, 
    user, 
    setUser, 
    chatData, 
    setChatData, 
    chats, 
    openSearch, 
    setOpenSearch, 
    updateChats, 
    setUpdateChats, 
    socket, 
    messages, 
    idUnseenMessages,
    setIdUnseenMessages,
    setMessages,
    setChats}

  return (
    <div className='App'>
      <chatContext.Provider value={values}>
        { chatsLoading 
        ? <ChatLoader />
        : <>
        <HeaderMain />
        <ContactsCarousel />
        <MessagesList />
        <Chat />
        <Search />
        </>}
      </chatContext.Provider>
    </div>
  )
}

export default App
