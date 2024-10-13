import { CustomError } from "../errors/custom.error";

export class UserEntity {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public password: string,
        public pictureUrl: string,
        public pictureId: string,
    ) { }

    static fromObject(object: { [key: string]: any }) {
        const { _id, email, name, password, pictureUrl, pictureId } = object;

        if (!_id) throw CustomError.badRequest('Missing user id');
        if (!email) throw CustomError.badRequest('Missing email');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!password) throw CustomError.badRequest('Missing password');
        if (!pictureUrl) throw CustomError.badRequest('Missing pictureUrl');
        if (!pictureId) throw CustomError.badRequest('Missing pictureId');

        return new UserEntity(_id, name, email, password, pictureUrl, pictureId);
    }
}

export class PartialUserEntity {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public pictureUrl: string,
        public pictureId: string,
    ) { }

    static fromObject(object: { [key: string]: any }) {
        const { _id, email, name, pictureUrl, pictureId } = object;

        if (!_id) throw CustomError.badRequest('Missing user id');
        if (!email) throw CustomError.badRequest('Missing email');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!pictureUrl) throw CustomError.badRequest('Missing pictureUrl');
        if (!pictureId) throw CustomError.badRequest('Missing pictureId');

        return new PartialUserEntity(_id, name, email, pictureUrl, pictureId);
    }
}
