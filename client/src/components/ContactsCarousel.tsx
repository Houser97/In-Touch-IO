import '../styles/ContactsCarousel.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import Contact from './Contact';
import { images } from '../assets/constants';
import { useContext } from 'react';
import { chatContext } from '../App';

let settings = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: false,
    dots: false,
}

const ContactsCarousel = () => {

    const { chats } = useContext(chatContext);

  return (
    <div className='contacts__carousel main__container'>
        {chats.length ? 
                <Slider {...settings} className='carousel'>
                <div className="contact">
                    <div className='contact__picture'>
                        <svg className='search__svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>
                    </div>
                    <div className="contact__name">Search</div>
                </div>
                {chats.map(({_id, users:[ , {_id: friendId, name, pictureUrl}]}) => {
                    return (
                        <Contact key={`ContactCarousel-${_id}`} name={name} picture={pictureUrl} id={friendId}/>
                    )
                })}
            </Slider>
            : 'Loading'
        }
    </div>
  )
}

export default ContactsCarousel