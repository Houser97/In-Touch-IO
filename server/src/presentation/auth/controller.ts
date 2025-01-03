import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { CustomError } from "../../domain/errors/custom.error";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";

export class AuthController {
    constructor(
        public readonly authService: AuthService,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    login = async (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.login(req.body)
        if (error) return res.status(400).json({ error });

        this.authService.login(loginUserDto!)
            .then(user => res.json(user))
            .catch(error => this.handleError(error, res));
    }

    register = async (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService.register(registerUserDto!)
            .then(user => res.json(user))
            .catch(error => this.handleError(error, res));
    }

    logout = (req: Request, res: Response) => {
        this.authService.logout(req, res)
    }

    checkStatus = (req: Request, res: Response) => {
        this.authService.checkStatus(req, res);
    }
}