import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import './App.css'
import { API } from './assets/constants'
import { useSocket } from './assets/socket'
import Chat from './components/Chat'
import ContactsCarousel from './components/ContactsCarousel'
import HeaderMain from './components/HeaderMain'
import MessagesList from './components/MessagesList'
import Search from './components/Search'
import { chat, chatContext_types, chat_object, message } from './TypeScript/typesApp'

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

  useEffect(() => {
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
      setUser({name, image, _id})
    })
  }, [])

  useEffect(() => {
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
    .then(chats => {
      if(!chats.length) return undefined
      const chatsObject = chats.reduce((acc: chat_object, chat: chat) => {
        if(!acc[chat._id]){
          acc[chat._id] = chat
        }
        return acc
      }, {})
      console.log(chatsObject)
      setChats(chatsObject);
    })
  }, [updateChats])

  useEffect(() => {
    if (!socket) return; // Si el socket no está listo, no hacemos nada en este efecto
  
    const messageReceivedHandler = (newMessage: message) => {
      if (chatData.id !== newMessage.chat._id || chatData.id === '') {
        return;
      }
      setMessages(prev => [...prev, newMessage]);
    };
  
    socket.on('message received', messageReceivedHandler);
  
    return () => {
      socket.off('message received', messageReceivedHandler);
    };
  }, [chatData.id, socket]);
  

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
    setMessages,
    setChats}

  return (
    <div className='App'>
      <chatContext.Provider value={values}>
        <HeaderMain />
        <ContactsCarousel />
        <MessagesList />
        <Chat />
        <Search />
      </chatContext.Provider>
    </div>
  )
}

export default App
