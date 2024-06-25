class CustomError extends Error {
    constructor(msg) {
        super(msg);
    }
}
export const custError = (msg) => new CustomError(msg);
