import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pictureUrl: {
        type: String,
        default: "https://res.cloudinary.com/dluwqcce9/image/upload/v1694961227/InTouch/qqaarw68ruwwluvcphkh.jpg"
    },
    pictureId: {
        type: String,
        default: "default"
    }
})

export const UserModel = mongoose.model('User', userSchema);