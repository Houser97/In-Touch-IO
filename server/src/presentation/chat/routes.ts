import { Router } from "express";
import { ChatService } from "../services/chat.service";
import { ChatController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { MessageService } from "../services/message.service";

export class ChatRoutes {
    static get routes(): Router {
        const router = Router();

        const messageService = new MessageService();
        const chatService = new ChatService(messageService);
        const controller = new ChatController(chatService);

        router.use(AuthMiddleware.validateJWT);

        router.get('/:id', controller.getChatById);
        router.get('/', controller.getChatsByUserId);
        router.post('/', controller.createChat);
        router.put('/:id', controller.updateChat);

        return router;
    }
}