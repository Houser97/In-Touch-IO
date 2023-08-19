import { Link } from 'react-router-dom'
import '../styles/Settings.css'

const Settings = () => {

    const id = JSON.parse(localStorage.getItem('idInTouch') || "");

  return (
    <div className='settings__container'>
        <Link className='logout__btn' to={`/settings/${id}`}>
            <span>Settings</span>
        </Link>
        <button className='logout__btn'>
            <span>Lot Out</span>
        </button>
    </div>
  )
}

export default Settings