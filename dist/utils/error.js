"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.custError = void 0;
class CustomError extends Error {
    constructor(msg) {
        super(msg);
    }
}
const custError = (msg) => new CustomError(msg);
exports.custError = custError;
