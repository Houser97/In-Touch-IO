import mongoose from "mongoose";
import { ChatModel } from "../../data/mongo/models/chat.model";
import { MessageModel } from "../../data/mongo/models/message.model";
import { CreateMessageDto } from "../../domain/dtos/messages/create-message.dto";
import { MessageEntity } from "../../domain/entities/message.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { UpdateMessageDto } from "../../domain/dtos/messages/update-message.dto";

export class MessageService {
    constructor() { }

    async getMessagesByChatId(chatId: string) {
        await this.checkChatStatus(chatId);

        const id = new mongoose.Types.ObjectId(chatId)

        try {
            const messages = await MessageModel.find({ chat: id });

            return messages.map(MessageEntity.fromObject);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async create(createMessageDto: CreateMessageDto) {
        const { chat: chatId } = createMessageDto;
        await this.checkChatStatus(chatId);

        try {
            const message = new MessageModel(createMessageDto);
            await message.save();
            return MessageEntity.fromObject(message);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getUnseenMessages(chatIds: string[], userId: string) {
        try {
            const messages = await MessageModel.find({
                isSeen: false,
                chat: { $in: chatIds },
                // sender: { $ne: userId }
            }).select('_id sender chat');

            const unseenMessagesByChat = messages.reduce((acc: { [key: string]: { id: string, sender: string }[] }, message) => {
                const { _id: id, sender, chat } = message;
                const key = chat!.toString();
                if (!(key in acc)) {
                    acc[key] = []
                }
                acc[key].push({ id: id.toString(), sender: sender!.toString() });
                return acc;
            }, {});

            return unseenMessagesByChat;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateMessagesStatus(updateMessageDto: UpdateMessageDto) {
        const { ids } = updateMessageDto
        try {
            const messages = await MessageModel.updateMany(
                { _id: { $in: ids } },
                { $set: { isSeen: true } }
            );
            return messages;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    private async checkChatStatus(chatId: string) {
        const chatExists = await ChatModel.findById(chatId);
        if (!chatExists) throw CustomError.badRequest('Chat does not exists');
    }

}