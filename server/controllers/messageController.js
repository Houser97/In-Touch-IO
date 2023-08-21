const Message = require('../models/message');
const User = require('../models/user');
const Chat = require('../models/chat');

exports.sendMessage = async(req, res) => {
    const { content, chatId } = req.body

    if(!content || !chatId) return res.json(false);

    const newMessage = {
        content,
        chat: chatId,
        sender: req.userId
    }

    try {
        let message = await Message.create(newMessage)
        message = await message.populate('sender', 'name pictureUrl');
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pictureUrl email'
        });

        //Actualizar chat con el último mensaje.
        await Chat.findByIdAndUpdate(chatId, {
            lastMsg: message
        })

        return res.json(message)
    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}

exports.chatMessages = async(req, res) => {
    try {
        const messages = await Message.find({chat: {$eq: body.params.chatId}})
        .populate('sender', 'name pictureUrl email')
        .populate('chat')

        return res.json(messages)
    } catch (error) {
        return res.json(error)
    }
}