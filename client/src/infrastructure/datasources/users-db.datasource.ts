import { UsersDatasource } from "../../domain/datasources/users.datasource";
import { User } from "../../domain/entities/user.entity";
import inTouchIoApi from "../../presentation/config/api/inTouchIoApi";
import { CustomError } from "../errors/custom.error";
import { UserDb } from "../interfaces/user-db.repository";
import { UserMapper } from "../mappers/user.mapper";

export class UsersDbDatasource extends UsersDatasource {
    async update(id: string, name: string, pictureUrl: string, newPictureId: string, oldPictureId: string): Promise<User> {
        try {
            const { data } = await inTouchIoApi.put<UserDb>(`/users/${id}`, {
                name,
                pictureUrl,
                pictureId: newPictureId,
                oldPublicId: oldPictureId
            });
            return UserMapper.toEntityFromUserDb(data);
        } catch (error) {
            console.log(error);
            throw CustomError.formatError(error);
        }
    }
    async getByNameOrEmail(value: string): Promise<User[]> {
        try {
            const { data } = await inTouchIoApi.get<UserDb[]>(`/users/?search=${value}`);
            return data.map(UserMapper.toEntityFromUserDb);
        } catch (error) {
            throw CustomError.formatError(error);
        }
    }

}