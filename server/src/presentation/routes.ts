import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { UserRoutes } from "./users/routes";
import { MessageRoutes } from "./messages/routes";
import { ChatRoutes } from "./chat/routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/users', UserRoutes.routes);
        router.use('/api/messages', MessageRoutes.routes);
        router.use('/api/chats', ChatRoutes.routes);


        return router;
    }
}