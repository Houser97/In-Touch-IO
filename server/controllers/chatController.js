const Chat = require('../models/chat');
const User = require('../models/user');

exports.accessChat = async(req, res) => {
    const friendId  = req.body.friendId;

    if(!friendId){
        return res.json(false)
    }

    let isChat = await Chat.find({
        isGroupChat: false,
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