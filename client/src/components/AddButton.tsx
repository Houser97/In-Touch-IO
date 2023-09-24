import { useContext } from 'react';
import { generalContext } from '../App';
import '../styles/AddButton.css'

const AddButton = ({text = ''}) => {

    const { setOpenSearch } = useContext(generalContext);

  return (
    <div className="contact add__btn" onClick={() => setOpenSearch(true)}>
        <div className='contact__picture svg__search-container'>
            <svg className='search__svg' viewBox="0 0 24 24"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>
        </div>
        <div className="contact__name">{text}</div>
    </div>
  )
}

export default AddButton