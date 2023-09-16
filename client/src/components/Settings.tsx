import { Link } from 'react-router-dom'
import '../styles/Settings.css'

const Settings = () => {

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
            <span>Lot Out</span>
        </Link>
    </div>
  )
}

export default Settings