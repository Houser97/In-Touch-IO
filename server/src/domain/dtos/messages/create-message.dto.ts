export class CreateMessageDto {
    private constructor(
        public readonly sender: string,
        public readonly content: string,
        public readonly chat: string,
        public readonly image: string,
    ) { }

    static create(props: { [key: string]: string }): [string?, CreateMessageDto?] {
        const { sender, content, chat, image } = props;

        if (!sender) return ['Missing sender'];
        if (!content && !image) return ['Missing content'];
        if (!chat) return ['Missing chat'];
        if (image !== undefined && typeof (image) !== 'string') return ['Missing must be a string'];

        return [undefined, new CreateMessageDto(sender, content, chat, image)];
    }
}