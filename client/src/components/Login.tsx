import { FormEvent, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
        <div className="email__container form__section-container">
            <label htmlFor="email" className="authentication__label">E-mail</label>
            <div className="form__section-container">
              <input id='email' type="text" name='email' onChange={(e) => setEmail(e.target.value)}/>
              <div className="topline"></div>
              <div className="underline"></div>
            </div>
        </div>
        <div className="password__container">
            <label htmlFor="pwd" className="authentication__label">Password</label>
            <div className="form__section-container">
              <input id='pwd' type="password" name='pwd' onChange={(e) => setPwd(e.target.value)}/>
              <div className="topline"></div>
              <div className="underline"></div>
            </div>
        </div>
        <button className="authentication__submit">
          <span className="circle1"></span>
          <span className="circle2"></span>
          <span className="circle3"></span>
          <span className="circle4"></span>
          <span className="circle5"></span>
          <span className="text">Login</span>
        </button>
        <div className="create__account-btn">
          <span>Don't have an account?</span> 
          <button className='authentication__swap' onClick={() => setIsLogin(false)}>Sign-up</button>
        </div>
    </form>
  )
}

export default Login