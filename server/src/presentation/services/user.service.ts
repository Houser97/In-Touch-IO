import { CloudinaryAdapter } from "../../config/cloudinary/cloudinary.adapter";
import { UserModel } from "../../data/mongo/models/user.model";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { PartialUserEntity, UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { UsernameQuery } from "../../domain/interfaces/username-query.interface";

export class UserService {
    constructor() { }

    async getByNameOrEmail(name: UsernameQuery) {
        try {
            const users = await UserModel.find(name);
            return users.map(PartialUserEntity.fromObject);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async update(id: string, oldPublicId: string, updateUserDto: UpdateUserDto) {

        const userExists = await UserModel.findById(id);

        if (!userExists) throw CustomError.badRequest('User does not exists');

        try {
            // const { secure_url, public_id } = await CloudinaryAdapter.uploadImage(pictureUrl); // Upload is made in frontend

            if (oldPublicId !== 'default') {
                await CloudinaryAdapter.deleteImageByPublicId(oldPublicId);
            }

            const user = await UserModel.findByIdAndUpdate(id, updateUserDto, { new: true });
            return UserEntity.fromObject(user!.toObject());
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}