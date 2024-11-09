import { UsersDatasource } from "../../domain/datasources/users.datasource";
import { User } from "../../domain/entities/user.entity";
import { UsersRepository } from "../../domain/repositories/users.repository";

export class UserRepositoryImpl extends UsersRepository {

    constructor(
        private readonly datasource: UsersDatasource
    ) {
        super()
    }

    update(id: string, name: string, pictureUrl: string, newPictureId: string, oldPictureId: string): Promise<User> {
        return this.datasource.update(id, name, pictureUrl, newPictureId, oldPictureId);
    }

    async getByNameOrEmail(value: string): Promise<User[]> {
        return this.datasource.getByNameOrEmail(value);
    }


}