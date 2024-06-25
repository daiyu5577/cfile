import { Command } from 'commander'
import chalk from 'chalk'
import { spinner } from '../utils/index.ts';

const program = new Command()
import runCreat from './command/creat.ts'

program
  .name('creat')
  .description('创建模板文件到指定目录')
  .option('-p, --path <string>', '路径')
  .action((options, command) => {
    runCreat(options)
      .catch(e => {
        // console.error(JSON.stringify(e.stack))
        // console.error(chalk.bgRed(e.message))
        spinner.fail(chalk.bgRed(e.message))
      })
  });


program.parse()