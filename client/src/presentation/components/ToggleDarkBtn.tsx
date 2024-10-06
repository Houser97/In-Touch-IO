import { useContext } from 'react';
import { generalContext } from '../../App';
import '../styles/ToggleDarkBtn.css'

const ToggleDarkBtn = () => {

  const { isDark, setIsDark } = useContext(generalContext);

  return (
    <div className={`toggle ${isDark && 'active'}`} onClick={() => setIsDark(!isDark)}>
      <i className='indicator'></i>
    </div>
  )
}

export default ToggleDarkBtn