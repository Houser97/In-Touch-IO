import { FormEvent, SetStateAction, useContext, useState } from 'react'
import '../../styles/auth/pages/SignUp.css'
import { useForm } from '../../hooks/useForm'
import { AuthContext } from '../../providers/AuthProvider'

interface Props {
  setIsLogin: React.Dispatch<SetStateAction<boolean>>,
}

export const RegisterScreen = ({ setIsLogin }: Props) => {

  const { username, email, password, onChange } = useForm({
    username: '',
    email: '',
    password: ''
  })

  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const { register, clearErrorMessage } = useContext(AuthContext);


  const handleSwap = () => {
    setIsLogin(true);
    clearErrorMessage();
  }

  const comparePasswords = (repeatPwd: string) => {
    setPasswordsMatch(repeatPwd === password)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await register(email, password, username);
  }


  return (
    <form className='authentication__form signup__form' onSubmit={handleSubmit}>
      <div className="email__container form__section-container">
        <label htmlFor="email" className="authentication__label">E-mail</label>
        <div className="form__section-container">
          <input id='email' type="text" name='email' onChange={onChange} required />
          <div className="topline"></div>
          <div className="underline"></div>
        </div>
      </div>
      <div className="name__container form__section-container">
        <label htmlFor="username" className="authentication__label">Username</label>
        <div className="form__section-container">
          <input id='username' type="text" name='username' onChange={onChange} />
          <div className="topline"></div>
          <div className="underline"></div>
        </div>
      </div>
      <div className={`password__container ${!passwordsMatch && 'no-match'}`}>
        <label htmlFor="pwd" className="authentication__label">Password</label>
        <div className="form__section-container">
          <input id='pwd' type="password" name='password' onChange={onChange} />
          <div className="topline"></div>
          <div className="underline"></div>
        </div>
      </div>
      <div className={`password__container ${!passwordsMatch && 'no-match'}`}>
        <label htmlFor="re-pwd" className="authentication__label">Repeat Password</label>
        <div className="form__section-container">
          <input id='re-pwd' type="password" name='re-pwd' onChange={(e) => comparePasswords(e.target.value)} />
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
};