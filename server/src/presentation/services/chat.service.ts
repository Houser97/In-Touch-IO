import { ChatModel } from "../../data/mongo/models/chat.model";
import { CreateChatDto } from "../../domain/dtos/chats/create-chat.dto";
import { CustomError } from "../../domain/errors/custom.error";
import { ChatEntity } from "../../domain/entities/chat.entity";
import { UpdateChatDto } from "../../domain/dtos/chats/update-chat.dto";
import { MessageService } from "./message.service";

export class ChatService {
    constructor(
        private readonly messageService: MessageService
    ) { }

    async getById(id: string, userId: string) {
        try {
            const chat = await ChatModel.findById(id)
                .populate('users', 'name email pictureUrl pictureId')
                .populate('lastMessage');
            if (!chat) throw CustomError.badRequest('Chat does not exist');

            const chatEntity = ChatEntity.fromObject(chat);
            const messages = await this.messageService.getUnseenMessages([chatEntity.id], userId);

            const unseenMessages = messages[chatEntity.id] || []

            return { chat: chatEntity, unseenMessages };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getChatsByUserId(userId: string) {
        try {
            const chats = await ChatModel.find({
                users: { $in: userId }
            }).populate('users', 'name email pictureUrl pictureId')
                .populate('lastMessage')
                .sort({ 'updatedAt': 'desc' });

            const chatsEntity = chats.map(ChatEntity.fromObject);

            const ids = chatsEntity.map(chat => chat.id);

            const messages = await this.messageService.getUnseenMessages(ids, userId);

            return { chats: chatsEntity, unseenMessages: messages };
        } catch (error) {
            console.log(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

    async create(createChatDto: CreateChatDto) {
        const { users } = createChatDto;

        const chatExists = await ChatModel.findOne({
            users: { $all: users }
        });

        if (chatExists) throw CustomError.badRequest('Chat already exists');

        try {
            const chat = new ChatModel(createChatDto);
            await chat.save();
            return ChatEntity.fromObject(chat);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async update(id: string, updateChatDto: UpdateChatDto) {
        try {
            const chat = await ChatModel.findByIdAndUpdate(id, updateChatDto, { new: true })
                .populate('users', 'name email pictureUrl pictureId')
                .populate('lastMessage');;
            return ChatEntity.fromObject(chat!.toObject());
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}