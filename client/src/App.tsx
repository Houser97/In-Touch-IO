import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { API } from './assets/constants'
import Chat from './components/Chat'
import ContactsCarousel from './components/ContactsCarousel'
import HeaderMain from './components/HeaderMain'
import MessagesList from './components/MessagesList'
import Search from './components/Search'
import { chatContext_types } from './TypeScript/typesApp'

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
    messages: []
  },
  openSearch: false,
  updateChats: false,
  setUpdateChats: () => false,
  setOpenSearch: () => false,
  setOpenChat: () => false,
  setUser: () => false,
  setChatData: () => false
})

function App() {

  const navigate = useNavigate();

  const [openChat, setOpenChat] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  // Estado que llama a API de chats cuando se crea un nuevo chat.
  const [updateChats, setUpdateChats] = useState(false)
  //Estado que se usa para mostrar datos del contacto al abrir el chat.
  const [chatData, setChatData] = useState({
    image: '',
    name: '',
    id: '',
    messages: [{   
      sender: {
        _id: '',
        image: '',
        name: ''
      },
      content: '',
      id: '',
      createdAt: ''
    }],
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
  

  const values = {setOpenChat, openChat, user, setUser, chatData, setChatData, chats, openSearch, setOpenSearch, updateChats, setUpdateChats}

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
