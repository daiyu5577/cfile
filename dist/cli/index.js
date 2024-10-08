"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../utils/index");
const program = new commander_1.Command();
const creat_1 = __importDefault(require("./command/creat"));
program
    .name('creat')
    .description('创建模板文件到指定目录')
    .requiredOption('-p, --path <string>', 'template output path')
    .action((options, command) => {
    const runCreat = new creat_1.default(options);
    runCreat.start()
        .catch(e => {
        // console.error(JSON.stringify(e.stack))
        // console.error(chalk.bgRed(e.message))
        index_1.spinner.fail(chalk_1.default.red(e.message));
    });
});
program.parse();
