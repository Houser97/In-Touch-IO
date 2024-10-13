import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: ''
    }
},
    {
        timestamps: true
    });

export const MessageModel = mongoose.model("Message", MessageSchema);