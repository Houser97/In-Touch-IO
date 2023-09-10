const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = Schema({
    name: {type:String, trim:true},
    isGroup: {type:Boolean, default:false},
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    lastMsg: {type:mongoose.Schema.Types.ObjectId, ref:"Message", default: null},
    groupAdmin: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
},
{
    timestamps:true
})

module.exports = mongoose.model("Chat", ChatSchema)