declare class CustomError extends Error {
    constructor(msg: string);
}
export declare const custError: (msg: string) => CustomError;
export {};
