import { Command } from 'commander'

const program = new Command()
import runCreat from './command/creat.ts'

program
  .name('creat')
  .description('创建模板文件到指定目录')
  .option('-p, --path <string>', '路径')
  .action((options, command) => {
    runCreat(options)
  });


program.parse()