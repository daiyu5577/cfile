import { Command } from 'commander';
import chalk from 'chalk';
import { spinner } from '../utils/index';
const program = new Command();
import runCreat from './command/creat';
program
    .name('creat')
    .description('创建模板文件到指定目录')
    .requiredOption('-p, --path <string>', '路径')
    .action((options, command) => {
    runCreat(options)
        .catch(e => {
        // console.error(JSON.stringify(e.stack))
        // console.error(chalk.bgRed(e.message))
        spinner.fail(chalk.bgRed(e.message));
    });
});
program.parse();
