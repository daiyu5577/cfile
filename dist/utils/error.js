"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.custError = void 0;
class CustomError extends Error {
    constructor(msg, errorName) {
        super(msg);
        this.name = errorName;
    }
}
const custError = (msg, errorName = 'CustomError') => new CustomError(msg, errorName);
exports.custError = custError;
