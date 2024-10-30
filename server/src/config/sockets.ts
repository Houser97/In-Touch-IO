import { Server } from 'socket.io';
import { MessageService } from '../presentation/services/message.service';
import { CreateMessageDto } from '../domain/dtos/messages/create-message.dto';
import { UpdateChatDto } from '../domain/dtos/chats/update-chat.dto';
import { ChatService } from '../presentation/services/chat.service';

export class Sockets {
    constructor(
        private readonly io: Server,
        private readonly messageService: MessageService,
        private readonly chatService: ChatService,
    ) {
        this.socketEvents();
        // io.listen(3002);
    }

    socketEvents() {
        this.io.on('connect', (socket) => {
            console.log('connected to socket.io');

            // New room using id of user.
            socket.on('setup', (userId) => {
                socket.join(userId);
            })

            // New room using id of user.
            socket.on('join-chat', (chatId) => {
                socket.join(chatId);
            })

            socket.on('personal-message', async (payload) => {
                const { chat, message } = payload;
                const [error, createMessageDto] = CreateMessageDto.create(message);

                if (error) {
                    console.log(error);
                    this.io.to(message.sender).emit('personal-message', error);
                    return;
                }

                try {
                    const message = await this.messageService.create(createMessageDto!);

                    const { id } = message;
                    const [_, updateChatDto] = UpdateChatDto.create({ lastMessage: id });
                    await this.chatService.update(chat.id, updateChatDto!)
                    const friendId = chat.users.filter((user: any) => user.id != message.sender)[0].id
                    const updatedChat = await this.chatService.getById(chat.id, friendId);

                    chat.users.forEach((user: any) => {
                        this.io.to(user.id).emit('personal-message', { message, chat: updatedChat });
                    });

                } catch (error) {
                    console.log(error)
                    this.io.to(message.sender).emit('personal-message', error);
                }

            })

            socket.off("setup", () => {
                //   socket.leave(userData._id);
            });
        })
    }
}