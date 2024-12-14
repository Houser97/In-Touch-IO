import axios from "axios";
import { CustomError } from "../../../infrastructure/errors/custom.error";

const UPLOAD_PRESET = 'InTouch'; // Must be configured as unsigned
const CLOUD_NAME = 'dluwqcce9';

const cloudinaryApi = axios.create({
    baseURL: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
});

export class ImageStorageAdapter {
    static uploadImage = async (file: Blob) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const { data } = await cloudinaryApi.post('', formData);
            const imageUrl = data.secure_url;
            const publicId = data.public_id;
            return { imageUrl, publicId };
        } catch (error) {
            console.error('Error al subir la imagen a Cloudinary:', error);
            throw CustomError.formatError(error);
        }
    }
}