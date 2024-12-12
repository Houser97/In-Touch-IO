import { useContext } from 'react';
import '../../../styles/ToggleDarkBtn.css'
import { UtilsContext } from '../../../providers/UtilsProvider';

const ToggleDarkBtn = () => {

  const { isDarkTheme, setIsDarkTheme } = useContext(UtilsContext);

  return (
    <div className={`toggle ${isDarkTheme && 'active'}`} onClick={() => setIsDarkTheme(!isDarkTheme)}>
      <i className='indicator'></i>
    </div>
  )
}

export default ToggleDarkBtn