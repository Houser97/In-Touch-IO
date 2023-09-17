import { FormEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generalContext } from '../App'
import { API, checkLocalStorage } from '../assets/constants'
import '../styles/Search.css'
import Contact from './Contact'

const Search = () => {

  const { openSearch, setOpenSearch } = useContext(generalContext)

  const [userSearchResult, setUserSearchResult] = useState([]);
  const [query, setQuery] = useState('');

  const navigate = useNavigate()

  const searchUsers = async(e: FormEvent) => {
    e.preventDefault();
    if(!checkLocalStorage()) {
      navigate('/')
      return undefined
    }
    const token = JSON.parse(localStorage.getItem("token") || '');
    const response =await fetch(`${API}/user/searchUser?search=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        
      }
    })
    const users = await response.json()
    if(users === false){
      navigate('/')
      return;
    }
    setUserSearchResult(users)
  }

  return (
    <div className={`search__container ${openSearch && 'show-search'}`}>
        <svg onClick={() => setOpenSearch(false)} className='arrow-left' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
        <form className="search__form" onSubmit={searchUsers}>
            <svg className="search__icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
            <input placeholder="Search" type="search" className="search__input" onChange={(e) => setQuery(e.target.value)} />
        </form>
        <div className="search__result">
          {
            userSearchResult.length
            ? userSearchResult.map(({name, pictureUrl, _id}) => {
              return(
                <Contact name={name} picture={pictureUrl} id={_id} key={_id} />
              )
            })
            
            : 'No users were found'
          }
        </div>
    </div>
  )
}

export default Search