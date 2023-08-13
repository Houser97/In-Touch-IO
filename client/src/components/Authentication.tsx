import { useState } from 'react'
import '../styles/Authentication.css'
import Login from './Login'
import SignUp from './SignUp'
import UpdateUser from './UpdateUser'
// {isLogin ? <Login setIsLogin={setIsLogin} /> : <SignUp setIsLogin={setIsLogin} />}
const Authentication = () => {

    const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="authentication__container">
      {isLogin ? <Login setIsLogin={setIsLogin} /> : <SignUp setIsLogin={setIsLogin} />}
    </div>
  )
}

export default Authentication