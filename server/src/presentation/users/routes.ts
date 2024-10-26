import { Router } from "express";
import { UserService } from "../services/user.service";
import { UserController } from "./controller";

export class UserRoutes {
    static get routes(): Router {
        const router = Router();

        const userService = new UserService();
        const controller = new UserController(userService);

        router.get('/', controller.getUserByNameOrEmail);
        router.put('/:id', controller.updateUser);

        return router;
    }
}