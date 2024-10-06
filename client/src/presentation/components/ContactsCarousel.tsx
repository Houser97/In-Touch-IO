import '../styles/ContactsCarousel.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import Contact from './Contact';
import { useContext } from 'react';
import { chatContext, generalContext } from '../../App';
import { user_type } from '../../TypeScript/typesApp';
import { checkLocalStorage } from '../../assets/constants';
import { useNavigate } from 'react-router-dom';
import AddButton from './AddButton';

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
    if (!checkLocalStorage()) {
        navigate('/')
        return <></>
    }
    const userId = JSON.parse(localStorage.getItem('idInTouch') || "");

    const Contacts = () => {
        return (
            Object.keys(chats).length ?

                Object.keys(chats).map((chatId) => {
                    const { users } = chats[chatId]
                    const friendData = users.filter((user: user_type) => user._id !== userId)
                    const { name, pictureUrl, _id: friendId } = friendData[0]
                    return (
                        <Contact key={`ContactCarousel-${chatId}`} name={name} picture={pictureUrl} id={friendId} />
                    )
                })
                : '')

    }

    return (
        <div className='contacts__carousel main__container'>
            <Slider {...settings} className='carousel'>
                <AddButton text={'Add'} />
                {Contacts()}
            </Slider>
        </div>
    )
}

export default ContactsCarousel