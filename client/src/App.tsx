import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { API, checkLocalStorage } from './assets/constants'
import { useSocket } from './assets/socket'
import Body from './components/Body'
import ContactsCarousel from './components/ContactsCarousel'
import HeaderMain from './components/HeaderMain'
import ChatLoader from './components/Loaders/ChatLoader'
import Search from './components/Search'
import { chat, chatContext_types, chat_object, generalContext_type, message, messagesContext_type, unseenMessage } from './TypeScript/typesApp'

export const chatContext = createContext<chatContext_types>({
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
  setUser: () => false,
  setChatData: () => false,
  setChats: () => {},
})

export const messagesContext = createContext<messagesContext_type>({
  messages: [],
  idUnseenMessages: [],
  setIdUnseenMessages: () => [],
  setMessages: () => [],
})

export const generalContext = createContext<generalContext_type>({
  openChat: false,
  openSearch: false,
  socket: null,
  updateChats: false,
  setUpdateChats: () => false,
  setOpenSearch: () => false,
  setOpenChat: () => false,
})

function App() {

  const navigate = useNavigate();

  const socket = useSocket()
  const [chatsLoading, setChatsLoading] = useState(true)
  const [openChat, setOpenChat] = useState(false);
  const [isOpenForTheFirstTime, setIsOpenForTheFirstTime] = useState(true) //Estado que ayuda a colocar Empty Chat si la aplicación se abrió por primera vez.
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
    createdAt: '',
    image: ''
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

  //useEffect para recuperar datos del usuario en base de datos.
  useEffect(() => {
    if(!checkLocalStorage()) {
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

  // useEffect para recuperar chats de base de datos cuando se crea un nuevo chat.
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

  //useEffect para establecer recepción de mensajes usando socket.
  useEffect(() => {
    if (!socket) return; // Si el socket no está listo, no hacemos nada en este efecto
  
    const messageReceivedHandler = (newMessage: message) => {
      const { chat: { _id: messageChatId }, _id: messageId, sender: { _id: senderId}, createdAt: messageCreatedAt } = newMessage;
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
  

  const valuesChat = {
    user, 
    setUser, 
    chatData, 
    setChatData, 
    chats, 
    setChats}

  const valuesMessage = {
    messages,
    idUnseenMessages,
    setIdUnseenMessages,
    setMessages,
  }

  const valuesGeneral = {
    openChat,
    openSearch,
    socket,
    updateChats,
    setUpdateChats,
    setOpenSearch,
    setOpenChat,
    isOpenForTheFirstTime,
    setIsOpenForTheFirstTime
  }

  return (
    <div className='App'>
      <generalContext.Provider value={valuesGeneral}>
      <chatContext.Provider value={valuesChat}>
        <messagesContext.Provider value={valuesMessage}>
        { chatsLoading 
        ? <ChatLoader />
        : <>
        <HeaderMain />
        <ContactsCarousel />
        <Body />
        <Search />
        </>}
        </messagesContext.Provider>
      </chatContext.Provider>
      </generalContext.Provider>
    </div>
  )
}

export default App
