import { Command } from 'commander'
import chalk from 'chalk'
import { spinner } from '../utils/index';

const program = new Command()
import RunCreat from './command/creat'

program
  .name('creat')
  .description('创建模板文件到指定目录')
  .requiredOption('-p, --path <string>', 'template output path')
  .action((options, command) => {
    const runCreat = new RunCreat(options)
    runCreat.start()
      .catch(e => {
        // console.error(JSON.stringify(e.stack))
        // console.error(chalk.bgRed(e.message))
        spinner.fail(chalk.red(e.message))
      })
  });


program.parse()