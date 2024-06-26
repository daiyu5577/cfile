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
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../../utils/index");
const error_1 = require("../../utils/error");
const runCreat = (params) => __awaiter(void 0, void 0, void 0, function* () {
    // tip
    // spinner.start(`正在加载模板...\n`)
    const tempUrl = path_1.default.resolve(__dirname, '../../template');
    const tempList = yield promises_1.default.readdir(tempUrl, { encoding: 'utf-8' });
    // spinner.info(`模板加载完成\n`)
    const answers = yield inquirer_1.default.prompt([
        {
            type: 'rawlist',
            name: 'projectName',
            message: '请选择代码片段',
            choices: [...tempList].map(v => ({
                name: v,
                value: v,
            }))
        },
        {
            type: 'input',
            name: 'fileName',
            message: "请输入文件名",
            validate(input, answers) {
                console.log(input, answers);
                if (!input) {
                    return chalk_1.default.yellow('文件名不能为空');
                }
                return true;
            }
        }
    ]);
    // tip 加载模板
    index_1.spinner.start(`开始创建模板...\n`);
    // check dir
    const targetUrl = path_1.default.resolve(process.cwd(), params.path, answers.fileName);
    yield (0, index_1.pathExistsReject)(targetUrl);
    // copy
    const targetTempUrl = path_1.default.resolve(tempUrl, answers.projectName);
    const isTargetTempUrl = yield fs_extra_1.default.pathExists(targetTempUrl);
    if (!isTargetTempUrl) {
        throw (0, error_1.custError)('');
    }
    yield fs_extra_1.default.copy(targetTempUrl, targetUrl);
    // tip 创建完成
    index_1.spinner.succeed(`创建完成...\n`);
});
exports.default = runCreat;
