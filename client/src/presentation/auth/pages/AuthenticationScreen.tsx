import { useContext, useEffect, useState } from 'react'
import '../../styles/auth/pages/Authentication.css'
import useDarkMode from '../../hooks/useDarkMode'
import { LoginScreen } from './LoginScreen'
import { RegisterScreen } from './RegisterScreen'
import { AuthContext } from '../../providers/AuthProvider'
import { images } from '../../assets/constants'

// {isLogin ? <Login setIsLogin={setIsLogin} /> : <SignUp setIsLogin={setIsLogin} />}
export const AuthenticationScreen = () => {

  const { auth } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true)
  const [isDark,] = useDarkMode()
  const { checkAuthToken } = useContext(AuthContext);

  useEffect(() => {
    checkAuthToken();
  }, [])

  return (
    <div className={`auth__container ${isDark ? 'dark' : 'light'}`}>
      <img src={images.auth} className='auth__img'></img>

      <div className="authentication__container">
        {isLogin ? <LoginScreen setIsLogin={setIsLogin} /> : <RegisterScreen setIsLogin={setIsLogin} />}

        <div>
          <ul className="errors">
            {auth.errorMessage && auth.errorMessage !== 'No token provider' && auth.errorMessage != 'Invalid Token' && <li>{auth.errorMessage}</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
