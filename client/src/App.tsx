import React, { createContext, useState } from 'react'
import './App.css'
import Chat from './components/Chat'
import ContactsCarousel from './components/ContactsCarousel'
import Header from './components/Header'
import MessagesList from './components/MessagesList'

interface chatData_types {
  image: string,
  name: string
}

interface chatContext_types {
  openChat: boolean,
  chatData: chatData_types,
  setOpenChat: React.Dispatch<React.SetStateAction<boolean>>,
  setChatData: React.Dispatch<React.SetStateAction<chatData_types>>
}

export const chatContext = createContext<chatContext_types>({
  openChat: false,
  chatData: {
    image: '',
    name: ''
  },
  setOpenChat: () => false,
  setChatData: () => false
})

function App() {

  const [openChat, setOpenChat] = useState(false)
  const [chatData, setChatData] = useState({
    image: '',
    name: ''
  })

  const values = {setOpenChat, openChat, chatData, setChatData}

  return (
    <div className='App'>
      <chatContext.Provider value={values}>
        <Header />
        <ContactsCarousel />
        <MessagesList />
        <Chat />
      </chatContext.Provider>
    </div>
  )
}

export default App
