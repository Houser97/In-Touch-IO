import { useState } from 'react'
import '../styles/Authentication.css'
import Login from './Login'
import SignUp from './SignUp'
import UpdateUser from './UpdateUser'

export interface validationError_type {
  msg: string
}

// {isLogin ? <Login setIsLogin={setIsLogin} /> : <SignUp setIsLogin={setIsLogin} />}
const Authentication = () => {

    const [isLogin, setIsLogin] = useState(true)
    const [validationErrors, setValidationErrors] = useState<validationError_type[]>([])

  return (
    <div className="authentication__container">
      {isLogin ? <Login setIsLogin={setIsLogin} setValidationErrors={setValidationErrors} /> : <SignUp setIsLogin={setIsLogin} setValidationErrors={setValidationErrors} />}
        
        <div>
        <ul className="errors">
          {validationErrors.map(({msg}, index) => {
            return(
              <li key={`validationError-${index}`}>{msg}</li>
            )
          })}
        </ul>
        </div>
    </div>
  )
}

export default Authentication