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
const slpParseTsxAddRouteStr_1 = __importDefault(require("../../plugins/slpParseTsxAddRouteStr"));
class RunCreat {
    constructor(params) {
        this.params = params;
        // 模板地址
        this.tempUrl = path_1.default.resolve(__dirname, '../../template');
        // 模板列表
        this.tempList = [];
        // 选择结果
        this.answers = {
            targetTemp: '',
            fileName: ''
        };
        // 生成目标路径
        this.targetUrl = '';
    }
    static add(fn) {
        RunCreat.plugins.push(fn);
        return this;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tempList = yield promises_1.default.readdir(this.tempUrl, { encoding: 'utf-8' });
            const answers = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'targetTemp',
                    message: '请选择代码片段',
                    choices: [...this.tempList].map(v => ({
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
            this.answers = answers;
            // tip 加载模板
            index_1.spinner.start(`开始创建模板...\n`);
            // check dir
            const targetUrl = path_1.default.resolve(process.cwd(), this.params.path, answers.fileName);
            this.targetUrl = targetUrl;
            yield (0, index_1.pathExistsReject)(targetUrl);
            // copy
            const copy = () => __awaiter(this, void 0, void 0, function* () {
                const targetTempUrl = path_1.default.resolve(this.tempUrl, answers.targetTemp);
                const isTargetTempUrl = yield fs_extra_1.default.pathExists(targetTempUrl);
                if (!isTargetTempUrl) {
                    throw (0, error_1.custError)('');
                }
                yield fs_extra_1.default.copy(targetTempUrl, targetUrl);
                // tip 创建完成
                index_1.spinner.succeed(`创建完成...\n`);
            });
            // run plugin
            for (let i = 0; i < RunCreat.plugins.length; i++) {
                yield RunCreat.plugins[i](this);
            }
            // copy
            copy();
        });
    }
}
// 插件
RunCreat.plugins = [];
// add plugin
RunCreat.add(slpParseTsxAddRouteStr_1.default);
exports.default = RunCreat;
