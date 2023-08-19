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
}

interface chatContext_types {
  openChat: boolean,
  user: user_type,
  chatData: chatData_type,
  setOpenChat: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<user_type>>,
  setChatData: React.Dispatch<React.SetStateAction<chatData_type>>
}

export const chatContext = createContext<chatContext_types>({
  openChat: false,
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
    image: ''
  },
  setOpenChat: () => false,
  setUser: () => false,
  setChatData: () => false
})

function App() {

  const navigate = useNavigate();

  const [openChat, setOpenChat] = useState(false)
  //Estado que se usa para mostrar datos del contacto al abrir el chat.
  const [chatData, setChatData] = useState({
    image: '',
    name: ''
  })
  const [user, setUser] = useState({
    image: {
      url: '',
      publicId: ''
    },
    name: '',
    id: '',
  })

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
  

  const values = {setOpenChat, openChat, user, setUser, chatData, setChatData}

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
