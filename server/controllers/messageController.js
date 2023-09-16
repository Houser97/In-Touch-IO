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

// El controlador se encarga de retornar los mensajes para un chat y de colocar
exports.chatMessages = async(req, res) => {
    try {
        const messagesToUpdate = req.body.unseenMessages
        const [messages] = await Promise.all([
            Message.find({chat: req.params.chatId}).populate('sender', 'name pictureUrl email'),
            Message.updateMany({_id: {$in: messagesToUpdate}}, {$set: {isSeen: true}})
        ])
        return res.json(messages)
    } catch (error) {
        return res.json(error)
    }
}

// El controlador se encarga de retornar los mensajes para un chat y de colocar
exports.updateMsgsToSeen = async(req, res) => {
    try {
        const messagesToUpdate = req.body.unseenMessages
        const updatedMsgs = await Message.updateMany({_id: {$in: messagesToUpdate}}, {$set: {isSeen: true}})
        return res.json(true)
    } catch (error) {
        return res.json(error)
    }
}