import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import { CreateChatDto } from "../../domain/dtos/chats/create-chat.dto";
import { CustomError } from "../../domain/errors/custom.error";
import { UpdateChatDto } from "../../domain/dtos/chats/update-chat.dto";

export class ChatController {
    constructor(
        private readonly chatService: ChatService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    getChatById = async (req: Request, res: Response) => {
        const id = req.params.id;

        // this.chatService.getById(id,)
        //     .then(chat => res.json(chat))
        //     .catch(error => this.handleError(error, res));
    }

    getChatsByUserId = async (req: Request, res: Response) => {
        const userId = req.body.user.id;

        this.chatService.getChatsByUserId(userId)
            .then(chats => res.json(chats))
            .catch(error => this.handleError(error, res));
    }

    createChat = async (req: Request, res: Response) => {
        const [error, createChatDto] = CreateChatDto.create(req.body);
        if (error) return res.status(400).json(error);

        this.chatService.create(createChatDto!)
            .then(chat => res.json(chat))
            .catch(error => this.handleError(error, res));
    }

    updateChat = async (req: Request, res: Response) => {
        const [error, updateChatDto] = UpdateChatDto.create(req.body);
        if (error) return res.status(400).json(error);

        const id = req.params.id;

        this.chatService.update(id, updateChatDto!)
            .then(chat => res.json(chat))
            .catch(error => this.handleError(error, res));
    }
}