import { ChangeEvent, FormEvent, useContext, useState } from 'react'
import '../../../styles/Chat/MessageInput.css'
import { AuthContext } from '../../../providers/AuthProvider';
import { MessageContext } from '../../../providers/MessageProvider';
import { ImageStorageAdapter } from '../../../config/storage/cloudinary.adapter';
import { FileAdapter } from '../../../config/file/file.adapter';

interface MsgInput_type {
  chatId: string,
  fileInputState: string,
  previewSource: string,
  selectedFile: Blob | null,
  setFileInputState: React.Dispatch<React.SetStateAction<string>>,
  setPreviewSource: React.Dispatch<React.SetStateAction<string>>,
  setSelectedFile: React.Dispatch<React.SetStateAction<Blob | null>>
}

const MessageInput = ({ chatId = '', fileInputState = '', previewSource = '', selectedFile = null, setFileInputState, setPreviewSource, setSelectedFile }: MsgInput_type) => {

  const [message, setMessage] = useState('');

  const { auth } = useContext(AuthContext);

  const { messages, sendMessage } = useContext(MessageContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !message.length) return;

    if (selectedFile) {
      const { imageUrl } = await ImageStorageAdapter.uploadImage(selectedFile);
      handleMessageCreation(imageUrl);
    } else {
      handleMessageCreation('');
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

  const handleMessageCreation = (image: string) => {
    setMessage('');
    setPreviewSource('');
    setSelectedFile(null);
    setFileInputState('');

    sendMessage(auth.user.id, message, image as string);
  }

  return (
    <form className='message__form' onSubmit={handleSubmit}>
      <label className={`message__img-label ${selectedFile && 'hide__input-img'}`} htmlFor="file">
        <svg viewBox="0 0 24 24" className='image_svg'><title>image-area</title><path d="M20,5A2,2 0 0,1 22,7V17A2,2 0 0,1 20,19H4C2.89,19 2,18.1 2,17V7C2,5.89 2.89,5 4,5H20M5,16H19L14.5,10L11,14.5L8.5,11.5L5,16Z" /></svg>
        <input
          type="file"
          id='file'
          name='image'
          accept="image/png, image/gif, image/jpeg, image/jpg"
          onChange={(e) => handleFileInputChange(e)}
          value={fileInputState}
          className='input__image-msg' />
      </label>
      <input type="text" className='message__input' name='message' maxLength={500} onChange={(e) => setMessage(e.target.value)} value={message} />
      <button type='submit' className='send__message'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>send-circle</title><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M8,7.71V11.05L15.14,12L8,12.95V16.29L18,12L8,7.71Z" /></svg>
      </button>
    </form>
  )
}

export default MessageInput
