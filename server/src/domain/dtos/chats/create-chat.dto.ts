export class CreateChatDto {
    private constructor(
        public readonly users: string[],
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateChatDto?] {
        const { users, lastMessage } = props;

        if (!users) return ['Missing users'];
        if (!Array.isArray(users)) return ['Users is not an array'];

        return [undefined, new CreateChatDto(users)];
    }
}