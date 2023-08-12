import { ChangeEvent, FormEvent, useState } from 'react';
import '../styles/UpdateUser.css'

const UpdateUser = () => {

    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null)

    const updateUser = async (e: FormEvent) => {
        e.preventDefault();
        if(!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            uploadImage(reader.result);
        }
        reader.onerror = () => {
            console.log('Error')
        }
    };

    const uploadImage = async (image: string | ArrayBuffer | null) => {
        try {
            await fetch(`http://localhost:3000/api/upload_image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({image})
            })
            setFileInputState('');
            setPreviewSource('');
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
    <div>
        <form className='update__user-form authentication__form' onSubmit={(e) => updateUser(e)}>
            <input 
                type="file" 
                name='image'
                onChange={(e) => handleFileInputChange(e)}
                value={fileInputState}
                className='input__image'/>
            <button className="authentication__submit">Sign Up</button>
        </form>
        {previewSource && (
            <img src={previewSource} alt="preview" />
        )}
    </div>
  )
}

export default UpdateUser