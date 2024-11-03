import { Request, Response } from "express";
import { MessageService } from "../services/message.service";
import { CreateMessageDto } from "../../domain/dtos/messages/create-message.dto";
import { CustomError } from "../../domain/errors/custom.error";
import { UpdateMessageDto } from "../../domain/dtos/messages/update-message.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";

export class MessageController {
    constructor(
        private readonly messageService: MessageService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }


    public getMessagesByChatId = (req: Request, res: Response) => {

        const chatId = req.params.chatId;
        const { page = 1, limit = 10 } = req.query;

        const [error, paginationDto] = PaginationDto.create(+page, +limit);

        if (error) return res.status(400).json({ error });

        this.messageService.getMessagesByChatId(chatId, paginationDto!)
            .then(messages => res.json(messages))
            .catch(error => this.handleError(error, res));
    }

    public createMessage = (req: Request, res: Response) => {
        const [error, createMessageDto] = CreateMessageDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.messageService.create(createMessageDto!)
            .then(message => res.json(message))
            .catch(error => this.handleError(error, res));
    }

    public updateMessagesStatus = (req: Request, res: Response) => {
        const [error, updateMessageDto] = UpdateMessageDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.messageService.updateMessagesStatus(updateMessageDto!)
            .then(message => res.json(message))
            .catch(error => this.handleError(error, res));
    }
}