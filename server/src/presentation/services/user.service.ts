import { CloudinaryAdapter } from "../../config/cloudinary/cloudinary.adapter";
import { UserModel } from "../../data/mongo/models/user.model";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class UserService {
    constructor() { }

    async update(id: string, updateUserDto: UpdateUserDto) {

        const userExists = await UserModel.findById(id);

        if (!userExists) throw CustomError.badRequest('User does not exists');

        try {
            const { pictureUrl, pictureId } = updateUserDto;

            const { secure_url, public_id } = await CloudinaryAdapter.uploadImage(pictureUrl);

            if (pictureId !== 'default') {
                await CloudinaryAdapter.deleteImageByPublicId(pictureId);
            }

            updateUserDto.pictureUrl = secure_url;
            updateUserDto.pictureId = public_id;

            const user = await UserModel.findByIdAndUpdate(id, updateUserDto, { new: true });
            return UserEntity.fromObject(user!.toObject());
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}