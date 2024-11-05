import { User } from "../entities/user.entity";

export abstract class UsersRepository {
    abstract update(id: string, name: string, pictureUrl: string, newPictureId: string, oldPictureId: string): Promise<User>;
    abstract getByNameOrEmail(value: string): Promise<User[]>;
}