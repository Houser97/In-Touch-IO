
import { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import '../styles/Search.css'
import SearchLoader from '../components/ui/loaders/SearchLoader';
import Contact from '../components/ui/Contact';
import { useUsers } from '../hooks/useUsers';
import { ChatContext } from '../providers/ChatProvider';
import { AuthContext } from '../providers/AuthProvider';
import { UtilsContext } from '../providers/UtilsProvider';


export const SearchScreen = () => {

    const { users, isLoading, getByNameOrEmail } = useUsers();
    const { isSearchOpen, setIsSearchOpen } = useContext(UtilsContext);
    const { userChats } = useContext(ChatContext);
    const { auth } = useContext(AuthContext);

    const AddedFriends = useMemo(() => {
        const chatIds = Object.keys(userChats);
        const UserId = auth.user.id;
        const friendList = chatIds.reduce((acc: string[], chatId: string) => {
            const { users } = userChats[chatId];
            const { id: friendId } = users.find((user) => user.id !== UserId)!;
            return [...acc, friendId];
        }, []);
        return friendList;
    }, [Object.keys(userChats).length, auth.user.id]);

    const [query, setQuery] = useState('');

    useEffect(() => {
        getByNameOrEmail(query);
    }, [])


    const searchUsers = async (e: FormEvent) => {
        e.preventDefault();
        getByNameOrEmail(query);
    }

    const FetchResult = () => {
        return (
            isLoading ?
                <div className='loader__container'>
                    <SearchLoader />
                </div>
                : <div className="search__result">
                    {
                        users.length
                            ? users.map(({ name, pictureUrl, id }) => {
                                return (

                                    <Contact name={name} picture={pictureUrl} id={id} key={id} added={AddedFriends.includes(id)} />
                                )
                            })

                            : 'No users were found'
                    }
                </div>
        )
    }

    return (
        <div className={`search__container ${isSearchOpen && 'show-search'}`}>
            <svg onClick={() => setIsSearchOpen(false)} className='arrow-left' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
            <form className="search__form" onSubmit={searchUsers}>
                <svg className="search__icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
                <input placeholder="Search" type="search" className="search__input" onChange={(e) => setQuery(e.target.value)} />
            </form>
            {FetchResult()}
        </div>
    )
}
