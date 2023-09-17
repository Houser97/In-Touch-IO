import { FormEvent, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../assets/constants'
import '../styles/SignUp.css'

interface SignUp_type {
    setIsLogin: React.Dispatch<SetStateAction<boolean>>,
    setValidationErrors: React.Dispatch<SetStateAction<validationError_type[]>>,
}

interface validationError_type {
  msg: string
}
  
  
const SignUp = ({setIsLogin, setValidationErrors}: SignUp_type) => {

  const navigate = useNavigate();

  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')
  const [email, setEmail] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const createUser = async (e: FormEvent) => {
    e.preventDefault()

    if(!passwordsMatch) return;
    const response = await fetch(`${API}/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, pwd, username})
    })

    const user = await response.json()
    if(Array.isArray(user)) {
      setValidationErrors(user)
    } else {
      const { id } = user
      const response = await fetch(`${API}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pwd,email})
      })
      const data = await response.json();
      if(Array.isArray(data)){
        setValidationErrors(data)
      } else {
        const { token, id } = data;
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('idInTouch', JSON.stringify(id));
        localStorage.setItem('userData', JSON.stringify({name:username, pictureUrl:''}));
        setEmail('');
        setPwd('');
        setValidationErrors([]);
        navigate(`/settings/${id}`)
      }
    }
  };

  const handleSwap = () => {
    setIsLogin(true);
    setValidationErrors([])
  }

  const comparePasswords = (repeatPwd: string) => {
    setPasswordsMatch(repeatPwd === pwd)
  }
  
    
  return (
    <form className='authentication__form signup__form' onSubmit={(e) => createUser(e)}>
        <div className="email__container form__section-container">
            <label htmlFor="email" className="authentication__label">E-mail</label>
            <div className="form__section-container">
              <input id='email' type="text" name='email' onChange={(e) => setEmail(e.target.value)} required/>
              <div className="topline"></div>
              <div className="underline"></div>
            </div>
        </div>
        <div className="name__container form__section-container">
            <label htmlFor="username" className="authentication__label">Username</label>
            <div className="form__section-container">
              <input id='username' type="text" name='username' onChange={(e) => setUsername(e.target.value)}/>
              <div className="topline"></div>
              <div className="underline"></div>
            </div>
        </div>
        <div className={`password__container ${!passwordsMatch && 'no-match'}`}>
            <label htmlFor="pwd" className="authentication__label">Password</label>
            <div className="form__section-container">
              <input id='pwd' type="password" name='pwd' onChange={(e) => setPwd(e.target.value)}/>
              <div className="topline"></div>
              <div className="underline"></div>
            </div>
        </div>
        <div className={`password__container ${!passwordsMatch && 'no-match'}`}>
            <label htmlFor="re-pwd" className="authentication__label">Repeat Password</label>
            <div className="form__section-container">
              <input id='re-pwd' type="password" name='re-pwd' onChange={(e) => comparePasswords(e.target.value)}/>
              <div className="topline"></div>
              <div className="underline"></div>
            </div>
        </div>
        <button className="authentication__submit signup__submit">
          <span className="circle1"></span>
          <span className="circle2"></span>
          <span className="circle3"></span>
          <span className="circle4"></span>
          <span className="circle5"></span>
          <span className="text">Sign Up</span>
        </button>
        <div className="create__account-btn">
          <span>Already an account?</span> 
          <button className='authentication__swap' onClick={() => handleSwap()}>Login</button>
        </div>
    </form>
  )
}

export default SignUp