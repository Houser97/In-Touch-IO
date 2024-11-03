import { CustomError } from "../errors/custom.error";
import { MessageEntity } from "./message.entity";
import { PartialUserEntity } from "./user.entity";

export class ChatEntity {
    constructor(
        public id: string,
        public users: PartialUserEntity[],
        public lastMessage: string,
        public updatedAt: Date
    ) { }

    static fromObject(object: { [key: string]: any }) {
        const { _id, users, lastMessage, updatedAt } = object;

        let messageEntity = lastMessage;

        if (!_id) throw CustomError.badRequest('Missing message id from object');
        if (!users) throw CustomError.badRequest('Missing users from object');
        if (lastMessage === undefined) throw CustomError.badRequest('Missing lastMessage from object');
        if (!updatedAt) throw CustomError.badRequest('Missing updatedAt from object');

        const partialUser = users.map(PartialUserEntity.fromObject);
        if (typeof (lastMessage) == 'object' && lastMessage) {
            messageEntity = MessageEntity.fromObject(lastMessage);
        }

        return new ChatEntity(_id, partialUser, messageEntity, updatedAt);
    }
}