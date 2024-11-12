import { ChangeEvent, FormEvent, SetStateAction, useContext, useEffect, useState } from 'react'

import { useForm } from '../../hooks/useForm'
import { AuthContext } from '../../providers/AuthProvider'
import ChatLoader from '../../components/ui/loaders/ChatLoader'

interface Props {
  setIsLogin: React.Dispatch<SetStateAction<boolean>>,
}

export const LoginScreen = ({ setIsLogin }: Props) => {

  const { email, password, onChange } = useForm({
    email: '',
    password: ''
  })

  const { login, clearErrorMessage } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true);
    await login(email.trim(), password);
    setIsLoading(false);
  }

  const handleSwap = () => {
    setIsLogin(false);
    clearErrorMessage();
  }

  const demoUser = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onChange({ target: { name: 'email', value: 'InTouchDemo@gmail.com' } } as ChangeEvent<HTMLInputElement>);
    onChange({ target: { name: 'password', value: 'ReactPassword97' } } as ChangeEvent<HTMLInputElement>);

    await login('InTouchDemo@gmail.com', 'ReactPassword97');
    setIsLoading(false);
  }

  return (
    <>
      {isLoading
        ? <ChatLoader />
        :
        <form className='authentication__form' onSubmit={handleSubmit}>
          <div className="email__container form__section-container">
            <label htmlFor="email" className="authentication__label">E-mail</label>
            <div className="form__section-container">
              <input id='email' type="text" name='email' onChange={onChange} />
              <div className="topline"></div>
              <div className="underline"></div>
            </div>
          </div>
          <div className="password__container">
            <label htmlFor="pwd" className="authentication__label">Password</label>
            <div className="form__section-container">
              <input id='pwd' type="password" name='password' onChange={onChange} />
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
          <button className="authentication__submit demo-user__button" onClick={demoUser}>
            <span className="circle1"></span>
            <span className="circle2"></span>
            <span className="circle3"></span>
            <span className="circle4"></span>
            <span className="circle5"></span>
            <span className="text">Demo User</span>
          </button>
          <div className="create__account-btn">
            <span>Don't have an account?</span>
            <button className='authentication__swap' onClick={() => handleSwap()}>Sign up</button>
          </div>
        </form>}
    </>
  )
}