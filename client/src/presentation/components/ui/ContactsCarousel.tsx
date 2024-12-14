import '../../styles/ContactsCarousel.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import Contact from './Contact';
import { useContext } from 'react';
import { ChatContext } from '../../providers/ChatProvider';
import { AuthContext } from '../../providers/AuthProvider';
import AddButton from './buttons/AddButton';

let settings = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: false,
    dots: false,
}

const ContactsCarousel = () => {

    const { userChats } = useContext(ChatContext);
    const { auth } = useContext(AuthContext);

    const Contacts = () => {
        return (
            Object.keys(userChats).length ?

                Object.keys(userChats).map((chatId: string) => {
                    const { users } = userChats[chatId]
                    const friendData = users.filter((user) => user.id !== auth.user.id)
                    const { name, pictureUrl, id: friendId } = friendData[0]
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