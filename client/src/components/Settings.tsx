import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkLocalStorage } from '../assets/constants'
import '../styles/Settings.css'
import ToggleDarkBtn from './ToggleDarkBtn'

const Settings = () => {

    const navigate = useNavigate()

    useEffect(() => {
      if(!checkLocalStorage()) {
        navigate('/')
        return undefined
      }
    }, [])
    
    const id = JSON.parse(localStorage.getItem('idInTouch') || "");

    const logout = () => {
      localStorage.removeItem('token')
    }

  return (
    <div className='settings__container'>
        <Link className='logout__btn' to={`/settings/${id}`}>
            <span>Settings</span>
        </Link>
        <Link className='logout__btn' to={`/`} onClick={logout}>
            <span>Log Out</span>
        </Link>
        <ToggleDarkBtn />
    </div>
  )
}

export default Settings