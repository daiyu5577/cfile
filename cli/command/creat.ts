import path from 'path';
import fs from 'fs/promises'
import fse from 'fs-extra'
import inquirer from 'inquirer';
import chalk from 'chalk';
import { spinner, pathExistsReject } from '../../utils/index';
import { custError } from '../../utils/error'

const runCreat = async (params: { path: string }) => {

  // tip
  // spinner.start(`正在加载模板...\n`)
  const tempUrl = path.resolve(__dirname, '../../template')
  const tempList = await fs.readdir(tempUrl, { encoding: 'utf-8' })
  // spinner.info(`模板加载完成\n`)

  const answers = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'projectName',
      message: '请选择代码片段',
      choices: [...tempList].map(v => (
        {
          name: v,
          value: v,
        }
      ))
    },
    {
      type: 'input',
      name: 'fileName',
      message: "请输入文件名",
      validate(input, answers) {
        console.log(input, answers)
        if (!input) {
          return chalk.yellow('文件名不能为空')
        }
        return true
      }
    }
  ])

  // tip 加载模板
  spinner.start(`开始创建模板...\n`)

  // check dir
  const targetUrl = path.resolve(process.cwd(), params.path, answers.fileName)
  await pathExistsReject(targetUrl)

  // copy
  const targetTempUrl = path.resolve(tempUrl, answers.projectName)
  const isTargetTempUrl = await fse.pathExists(targetTempUrl)
  if (!isTargetTempUrl) {
    throw custError('')
  }

  await fse.copy(targetTempUrl, targetUrl)

  // tip 创建完成
  spinner.succeed(`创建完成...\n`)
}

export default runCreat