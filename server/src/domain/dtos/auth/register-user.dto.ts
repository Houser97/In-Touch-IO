import { regularExps } from "../../../config/regular-exp";

export class RegisterUserDto {
    constructor(
        public email: string,
        public password: string,
        public name: string,
    ) { }

    static create(object: { [key: string]: string }): [string?, RegisterUserDto?] {
        const { email, password, name } = object;

        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Email is not valid'];

        if (!password) return ['Missing password'];
        if (!name) return ['Missing name'];

        return [undefined, new RegisterUserDto(email, password, name)]
    }
}