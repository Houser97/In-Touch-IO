const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: {type: String, trim: true},
    chat: {type: mongoose.Schema.Types.ObjectId, ref: "Chat"},
    isSeen: {type: Boolean, default: false},
    image: {type: String, default: ''}
},
{
    timestamps:true
});

module.exports = mongoose.model("Message", MessageSchema);