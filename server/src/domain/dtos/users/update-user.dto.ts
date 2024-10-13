export class UpdateUserDto {
    private constructor(
        public readonly name: string,
        public pictureUrl: string,
        public pictureId: string,
    ) { }

    static create(props: { [key: string]: string }): [string?, UpdateUserDto?] {
        const { name, pictureUrl, pictureId } = props;

        if (!name) return ['Missing name'];
        if (!pictureUrl) return ['Missing pictureUrl'];
        if (!pictureId) return ['Missing pictureId'];

        return [undefined, new UpdateUserDto(name, pictureUrl, pictureId)];
    }
}