import React from 'react'
import '../../styles/Chat/ImagePreview.css'

interface ImagePreview_type {
    previewSource: string,
    setPreviewSource: React.Dispatch<React.SetStateAction<string>>,
    setFileInputState: React.Dispatch<React.SetStateAction<string>>,
    setSelectedFile: React.Dispatch<React.SetStateAction<Blob | null>>,
}

const ImagePreview = ({previewSource = '', setPreviewSource, setFileInputState, setSelectedFile}: ImagePreview_type) => {

    const closeImagePreview = () => {
        setPreviewSource('');
        setFileInputState('');
        setSelectedFile(null)
    }

  return (
    <div className={`image__input-container ${previewSource.length > 0 && 'show-image-input'}`}>
        <svg onClick={closeImagePreview} className='arrow-left-preview' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
        <img className='preview__message-img' src={previewSource} alt="preview" />
    </div>
  )
}

export default ImagePreview