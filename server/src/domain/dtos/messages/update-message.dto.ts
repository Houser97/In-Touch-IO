export class UpdateMessageDto {
    private constructor(
        public readonly ids: string[]
    ) { }

    static create(props: { [key: string]: string[] }): [string?, UpdateMessageDto?] {
        const { messageIds } = props;

        if (!messageIds) return ['Missing messageIds'];

        return [undefined, new UpdateMessageDto(messageIds)];
    }
}