import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    lastMessage: {
        type: String,
        ref: "Message",
        default: null
    },
},
    {
        timestamps: true
    })

export const ChatModel = mongoose.model("Chat", ChatSchema)