import { User } from "../../domain/entities/user.entity";
import { UserDb, UserDBResponse } from "../interfaces/user-db.repository";

export class UserMapper {
    static toEntity(user: UserDBResponse): User {
        return {
            id: user.user.id,
            email: user.user.email,
            name: user.user.name,
            pictureId: user.user.pictureId,
            pictureUrl: user.user.pictureUrl,
        }
    }

    static toEntityFromUserDb(user: UserDb): User {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            pictureId: user.pictureId,
            pictureUrl: user.pictureUrl,
        }
    }
}