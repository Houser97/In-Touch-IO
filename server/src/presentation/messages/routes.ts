import { Router } from "express";
import { MessageService } from "../services/message.service";
import { MessageController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class MessageRoutes {
    static get routes(): Router {
        const router = Router();

        const messageService = new MessageService();
        const controller = new MessageController(messageService);

        router.use(AuthMiddleware.validateJWT);

        // TODO: Validación de que el usuario que hace petición esté en el chat.
        router.get('/:chatId', controller.getMessagesByChatId);

        router.post('/', controller.createMessage);
        router.put('/', controller.updateMessagesStatus);

        return router;
    }
}