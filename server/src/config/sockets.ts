import { Server } from 'socket.io';

export class Sockets {
    constructor(
        private readonly io: Server,
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
            // // New room using id of user.
            // socket.on('join chat', (room) => {
            //     socket.join(room);
            // })

            socket.on('new message', (newMessage) => {
                const chat = newMessage.chat

                if (!chat.users.length) return

                chat.users.forEach((user: { _id: string | string[]; }) => {
                    socket.in(user._id).emit('message received', newMessage)
                })
            })

            socket.off("setup", () => {
                //   socket.leave(userData._id);
            });
        })
    }
}