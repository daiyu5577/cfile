"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathExistsReject = exports.spinner = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const ora_1 = __importDefault(require("ora"));
const error_1 = require("../utils/error");
exports.spinner = (0, ora_1.default)();
const pathExistsReject = (p) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield fs_extra_1.default.pathExists(p);
    return isExists ? Promise.reject((0, error_1.custError)(`${p} 已存在`)) : Promise.resolve(false);
});
exports.pathExistsReject = pathExistsReject;
