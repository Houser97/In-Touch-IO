import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import './App.css'
import { API } from './assets/constants'
import Chat from './components/Chat'
import ContactsCarousel from './components/ContactsCarousel'
import HeaderMain from './components/HeaderMain'
import MessagesList from './components/MessagesList'
import Search from './components/Search'
import { chatContext_types, message } from './TypeScript/typesApp'

export const chatContext = createContext<chatContext_types>({
  openChat: false,
  chats: [],
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
  setChatData: () => false
})

function App() {

  const navigate = useNavigate();

  const [socket, setSocket] = useState<Socket | null>(null);
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

  const [chats, setChats] = useState([])

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
      setChats(chats);
    })
  }, [updateChats])

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('idInTouch') || '');
    const newSocket = io("http://localhost:3000", {
      transports: ['websocket', 'polling', 'flashsocket']
    });

    newSocket.emit("setup", userId);
    newSocket.on("connection", () => {
      console.log('Cui cui');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Asegurarse de desconectar el socket cuando el componente se desmonte
    };
  }, []);

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
    setMessages}

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
