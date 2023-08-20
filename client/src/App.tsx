import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { API } from './assets/constants'
import Chat from './components/Chat'
import ContactsCarousel from './components/ContactsCarousel'
import HeaderMain from './components/HeaderMain'
import MessagesList from './components/MessagesList'

interface image_type {
  url: string,
  publicId: string,
}

interface user_type {
  image: image_type,
  name: string,
  id: string
}

interface chatData_type {
  image: string,
  name: string,
  id: string
}

interface chat {
  _id: string,
  name: string,
  pictureUrl: string
}

interface chats_type {
  _id: string,
  users: chat[]
}

interface chatContext_types {
  openChat: boolean,
  user: user_type,
  chatData: chatData_type,
  chats: chats_type[],
  openSearch: boolean,
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>,
  setOpenChat: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<user_type>>,
  setChatData: React.Dispatch<React.SetStateAction<chatData_type>>
}

export const chatContext = createContext<chatContext_types>({
  openChat: false,
  chats: [],
  user: {
    image: {
      url: '',
      publicId: ''
    },
    name: '',
    id: ''
  },
  chatData: {
    name: '',
    image: '',
    id: ''
  },
  openSearch: false,
  setOpenSearch: () => false,
  setOpenChat: () => false,
  setUser: () => false,
  setChatData: () => false
})

function App() {

  const navigate = useNavigate();

  const [openChat, setOpenChat] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  //Estado que se usa para mostrar datos del contacto al abrir el chat.
  const [chatData, setChatData] = useState({
    image: '',
    name: '',
    id: ''
  })
  const [user, setUser] = useState({
    image: {
      url: '',
      publicId: ''
    },
    name: '',
    id: '',
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
      const { name, pictureUrl, publicId, _id } = user
      const image = {
        url: pictureUrl,
        publicId
      }
      setUser({name, image, id: _id})
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
  }, [])
  

  const values = {setOpenChat, openChat, user, setUser, chatData, setChatData, chats, openSearch, setOpenSearch}

  return (
    <div className='App'>
      <chatContext.Provider value={values}>
        <HeaderMain />
        <ContactsCarousel />
        <MessagesList />
        <Chat />
      </chatContext.Provider>
    </div>
  )
}

export default App
