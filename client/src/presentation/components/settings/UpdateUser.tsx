import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDarkMode from '../../hooks/useDarkMode';
import '../../styles/UpdateUser.css'
import CropEasy from '../crop/CropEasy';
import { AuthContext } from '../../providers/AuthProvider';
import { useUsers } from '../../hooks/useUsers';
import { ImageStorageAdapter } from '../../config/storage/cloudinary.adapter';
import { FileAdapter } from '../../config/file/file.adapter';

const UpdateUser = () => {

    const navigate = useNavigate();
    const [isDark,] = useDarkMode();
    const { updateUser } = useUsers();

    const { auth } = useContext(AuthContext);
    const userData = auth.user;

    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState(userData.pictureUrl);
    const [previewSourceCrop, setPreviewSourceCrop] = useState('');
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null)
    const [newUsername, setNewUsername] = useState(userData.name)

    const update = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            update_user(userData.pictureUrl, userData.pictureId, newUsername);
            return;
        };
        const { imageUrl, publicId } = await ImageStorageAdapter.uploadImage(selectedFile);
        update_user(imageUrl, publicId, newUsername)
    };

    const update_user = async (image: string, imageId: string, username: string) => {
        try {
            await updateUser(userData.id, username, image, imageId, userData.pictureId);
            setFileInputState('');
            setPreviewSource('');

            navigate('/chats')
        } catch (error) {
            console.log(error);
        }
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const file = target.files && target.files[0]
        if (!file) return;
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(target.value);
    }


    const previewFile = async (file: File) => {
        try {
            const filePreview = await FileAdapter.readAsDataURL(file);
            setPreviewSource(filePreview as string);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className={`update__user-container ${isDark ? 'dark' : 'light'}`}>
            <form className="update__user-form authentication__form" onSubmit={(e) => update(e)}>
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
                        className='input__image' />
                    {previewSource && (
                        <img className='preview__update-user' src={previewSource} alt="preview" />
                    )}
                </label>
                <div className='change__username form__section-container'>
                    <label htmlFor="username">Username</label>
                    <div className="form__section-container">
                        <input type="text" name='username' id='username' value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                        <div className="topline"></div>
                        <div className="underline"></div>
                    </div>
                    <button className="authentication__submit">Update</button>
                </div>
                <CropEasy
                    photoURL={previewSourceCrop}
                    setPreviewSourceParent={setPreviewSource}
                    setPhotoURL={setPreviewSourceCrop}
                    setFile={setSelectedFile} />
            </form>
        </div>
    )
}

export default UpdateUser