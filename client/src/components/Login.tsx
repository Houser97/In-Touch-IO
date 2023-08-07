import { FormEvent, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'

interface Login_type {
  setIsLogin: React.Dispatch<SetStateAction<boolean>>
}

const Login = ({setIsLogin}: Login_type) => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const login = (e: FormEvent) => {
    e.preventDefault();
    if(!email || !pwd) return undefined;
    fetch(`http://localhost:3000/api/login`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({pwd,email})
  }).then(response => response.json())
  .then(token => {
    localStorage.setItem('token', JSON.stringify(token))
    navigate('/chats')
  })
  }

  return (
    <form className='authentication__form' onSubmit={(e) => login(e)}>
        <div className="email__container">
            <label htmlFor="email" className="authentication__label">E-mail</label>
            <input id='email' type="text" name='email' onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="password__container">
            <label htmlFor="pwd" className="authentication__label">Password</label>
            <input id='pwd' type="password" name='pwd' onChange={(e) => setPwd(e.target.value)}/>
        </div>
        <button className="authentication__submit">Login</button>
        <button className='authentication__swap' onClick={() => setIsLogin(false)}>Create Account</button>
    </form>
  )
}

export default Login