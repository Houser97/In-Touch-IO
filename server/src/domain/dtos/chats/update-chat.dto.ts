export class UpdateChatDto {
    private constructor(
        public readonly lastMessage: string,
    ) { }

    static create(props: { [key: string]: string }): [string?, UpdateChatDto?] {
        const { lastMessage } = props;

        if (!lastMessage) return ['Missing lastMessage'];

        return [undefined, new UpdateChatDto(lastMessage)];
    }
}