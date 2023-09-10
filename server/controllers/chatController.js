const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user');

exports.accessChat = async(req, res) => {
    const friendId  = req.body.friendId;

    if(!friendId  || friendId === req.userId){
        return res.json(false)
    }

    let isChat = await Chat.find({
        isGroup: false,
        $and: [
            { users: { $elemMatch: { $eq: req.userId } } },
            { users: { $elemMatch: { $eq: friendId } } }
        ]
    })
    .populate("users", "-password")
    .populate("lastMsg")

    isChat = await User.populate(isChat, {
        path: 'lastMsg.sender',
        select: 'name pictureUrl email'
    })

    if(isChat.length > 0) {
        return res.json(isChat[0])
    }
    //Si el chat no existe entonces se crea
    const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.userId, friendId]
    }

    try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id}).populate('users', '-password')
        return res.json(fullChat)
    } catch (error) {
        return res.json(error)
    }
}


exports.findUserChats = async(req, res) => {
    /*
    const [chats, unseenMessages] = await Promise.all([
        Chat.find({ users: { $elemMatch: { $eq:req.userId }}})
        .populate("users", "-password").populate('lastMsg', '-chat -_id -createdAt').sort({ updatedAt: -1 }),
        Message.find({isSeen: false}).select('_id chat sender')
    ])*/
    const chats = await Chat.find({ users: { $elemMatch: { $eq:req.userId }}})
    .populate("users", "-password").populate('lastMsg', '-chat -_id -createdAt').sort({ updatedAt: -1 });
    const chatsId = chats.map(chat => chat._id)
    const unseenMessages = await Message.find({isSeen: false, chat: {$in:chatsId}}).select('_id chat sender')
    return res.json({chats, unseenMessages});
}