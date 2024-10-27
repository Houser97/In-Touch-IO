import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { UserService } from "../services/user.service";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { UsernameQuery } from "../../domain/interfaces/username-query.interface";



export class UserController {
    constructor(
        public readonly userService: UserService,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    updateUser = async (req: Request, res: Response) => {
        const [error, updateUserDto] = UpdateUserDto.create(req.body);
        const { oldPublicId } = req.body;
        if (error) return res.status(400).json({ error });

        const id = req.params.id;

        this.userService.update(id, oldPublicId, updateUserDto!)
            .then(user => res.json(user))
            .catch(error => this.handleError(error, res));

    }

    getUserByNameOrEmail = async (req: Request, res: Response) => {
        const search = req.query.search as string;
        const query: UsernameQuery = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }
            : {}

        this.userService.getByNameOrEmail(query)
            .then(users => res.json(users))
            .catch(error => this.handleError(error, res));
    }

}