import { CustomError } from "../errors/custom.error";

export class MessageEntity {
    constructor(
        public id: string,
        public sender: string,
        public content: string,
        public chat: string,
        public isSeen: boolean,
        public image: string,
        public createdAt: Date,
    ) { }

    static fromObject(object: { [key: string]: any }) {
        const { _id, sender, content, chat, isSeen, image = '', createdAt } = object;

        if (!_id) throw CustomError.badRequest('Missing message id from object');
        if (!sender) throw CustomError.badRequest('Missing sender from object');
        if (content === undefined) throw CustomError.badRequest('Missing content from object');
        if (!chat) throw CustomError.badRequest('Missing chat from object');
        if (isSeen === undefined) throw CustomError.badRequest('Missing isSeen from object');
        if (image == undefined) throw CustomError.badRequest('Missing image from object');
        if (!createdAt) throw CustomError.badRequest('Missing createdAt from object');

        return new MessageEntity(_id, sender, content, chat, isSeen, image, createdAt);
    }
}