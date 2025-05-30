import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import '../../styles/HeaderMain.css'
import Settings from '../settings/Settings';
import Contact from './Contact';


const HeaderMain = () => {

  const { auth } = useContext(AuthContext);
  const { name, pictureUrl } = auth.user

  return (
    <header className='header main__container'>
      <section>
        <div className="greetings__message">Hello {name},</div>
        <h2 className="app__title">In-Touch IO</h2>
      </section>
      <svg className='edit__svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
      <Contact picture={pictureUrl} />
      <Settings />
    </header>
  )
}

export default HeaderMain