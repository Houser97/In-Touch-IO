import { FormEvent, SetStateAction, useState } from 'react'
import '../styles/SignUp.css'

interface SignUp_type {
    setIsLogin: React.Dispatch<SetStateAction<boolean>>
  }
  
  const SignUp = ({setIsLogin}: SignUp_type) => {

    const [username, setUsername] = useState('')
    const [pwd, setPwd] = useState('')
    const [email, setEmail] = useState('')
    const [repeatPwd, setRepeatPwd] = useState('')

    const createUser = async (e: FormEvent) => {

    };
    

  return (
    <form className='authentication__form signup__form' onSubmit={(e) => createUser(e)}>
        <div className="email__container form__section-container">
            <label htmlFor="email" className="authentication__label">E-mail</label>
            <div className="form__section-container">
              <input id='email' type="text" name='email' onChange={(e) => setEmail(e.target.value)}/>
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
        <div className="password__container">
            <label htmlFor="pwd" className="authentication__label">Password</label>
            <div className="form__section-container">
              <input id='pwd' type="password" name='pwd' onChange={(e) => setPwd(e.target.value)}/>
              <div className="topline"></div>
              <div className="underline"></div>
            </div>
        </div>
        <div className="password__container">
            <label htmlFor="re-pwd" className="authentication__label">Repeat Password</label>
            <div className="form__section-container">
              <input id='re-pwd' type="password" name='re-pwd' onChange={(e) => setRepeatPwd(e.target.value)}/>
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
          <button className='authentication__swap' onClick={() => setIsLogin(true)}>Login</button>
        </div>
    </form>
  )
}

export default SignUp