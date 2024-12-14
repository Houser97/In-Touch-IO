import '../../App.css'
import ContactsCarousel from '../components/ui/ContactsCarousel';
import Body from '../components/home/Body';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../providers/ChatProvider';
import { AuthContext } from '../providers/AuthProvider';
import { SearchScreen } from './SearchScreen';
import { UtilsContext } from '../providers/UtilsProvider';
import HeaderMain from '../components/ui/HeaderMain';

export const HomeScreen = () => {

    const { isDarkTheme } = useContext(UtilsContext);
    const { getUserChats } = useContext(ChatContext);
    const { checkAuthToken } = useContext(AuthContext);

    useEffect(() => {
        getUserChats();
    }, []);

    useEffect(() => {
        checkAuthToken();
    }, []);

    return (
        <div className={`App ${isDarkTheme ? 'dark' : 'light'}`}>
            <HeaderMain />
            <ContactsCarousel />
            <Body />
            <SearchScreen />
        </div>
    )
}
