import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API, checkLocalStorage } from '../assets/constants';
import useDarkMode from '../hooks/useDarkMode';
import '../styles/UpdateUser.css'

const UpdateUser = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [isDark, ] = useDarkMode();

    useEffect(() => {
        if(!checkLocalStorage() || !localStorage.getItem('userData')) {
            navigate('/')
            return undefined
        }
    }, [])
    

    const userData = JSON.parse(localStorage.getItem('userData') || "");

    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState(userData.pictureUrl);
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null)
    const [newUsername, setNewUsername] = useState(userData.name)

    const updateUser = async (e: FormEvent) => {
        e.preventDefault();
        if(!selectedFile) {
            update_user('', newUsername);
            return;
        };
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            update_user(reader.result, newUsername);
        }
        reader.onerror = () => {
            console.log('Error')
        }
    };

    const update_user = async (image: string | ArrayBuffer | null, username: string) => {
        const token = JSON.parse(localStorage.getItem('token') || "");
        try {
            const response = await fetch(`${API}/user/update_user/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({image, username})
            })
            const data = await response.json()
            setFileInputState('');
            setPreviewSource('');
            if(!data){
                navigate('/')
                return;
            }
            navigate('/chats')
        } catch (error) {
            console.log(error);
        }
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const file = target.files && target.files[0]
        if(!file) return;
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(target.value);
    }

    const previewFile = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result as string);
        }
    }
    

  return (
    <form className={`update__user-form authentication__form ${isDark ? 'dark' : 'light'}`} onSubmit={(e) => updateUser(e)}>
        <label className="custum-file-upload" htmlFor="file">
            <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>camera</title><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" /></svg>
            </div>
            <div className="text">
                <span>Click to upload image</span>
            </div>
            <input 
                type="file" 
                id='file'
                name='image'
                accept="image/png, image/gif, image/jpeg, image/jpg"
                onChange={(e) => handleFileInputChange(e)}
                value={fileInputState}
                className='input__image'/>
            {previewSource && (
                <img className='preview__update-user' src={previewSource} alt="preview" />
            )}
        </label>
        <div className='change__username form__section-container'>
            <label htmlFor="username">Username</label>
            <div className="form__section-container">
                <input type="text" name='username' id='username' value={newUsername} onChange={e => setNewUsername(e.target.value)} required/>
                <div className="topline"></div>
                <div className="underline"></div>
            </div>
            <button className="authentication__submit">Update</button>
        </div>
    </form>
  )
}

export default UpdateUser