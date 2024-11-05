export class CustomError extends Error {
    constructor(
        public readonly status: number,
        public readonly message: string,
    ) {
        super(message)
    }

    static formatError(error: any) {
        console.log(error);
        if (error.response) {
            const { status, data } = error.response;
            return new CustomError(status, data.error);
        }
        return new CustomError(500, error.message);
    }
}