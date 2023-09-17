import '../styles/ContactsCarousel.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import Contact from './Contact';
import { useContext } from 'react';
import { chatContext, generalContext } from '../App';
import { user_type } from '../TypeScript/typesApp';
import { checkLocalStorage } from '../assets/constants';
import { useNavigate } from 'react-router-dom';

let settings = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: false,
    dots: false,
}

const ContactsCarousel = () => {

    const navigate = useNavigate()
    const { chats } = useContext(chatContext);
    const { setOpenSearch } = useContext(generalContext);
    if(!checkLocalStorage()) {
        navigate('/')
        return undefined
      }
    const userId = JSON.parse(localStorage.getItem('idInTouch') || "");

    const Contacts = () => {
        return(
        Object.keys(chats).length ? 

                Object.keys(chats).map((chatId) => {
                    const { users  } = chats[chatId]
                    const friendData = users.filter((user: user_type) => user._id !== userId)
                    const {name, pictureUrl, _id: friendId} = friendData[0]
                    return (
                        <Contact key={`ContactCarousel-${chatId}`} name={name} picture={pictureUrl} id={friendId}/>
                    )
                })
            : '')
        
    }

  return (
    <div className='contacts__carousel main__container'>
        <Slider {...settings} className='carousel'>
            <div className="contact" onClick={() => setOpenSearch(true)}>
                <div className='contact__picture svg__search-container'>
                    <svg className='search__svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>
                </div>
                <div className="contact__name">Search</div>
            </div>
            {Contacts()}
        </Slider>
    </div>
  )
}

export default ContactsCarousel