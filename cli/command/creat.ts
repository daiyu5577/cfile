import path from 'path';
import fs from 'fs/promises'
import fse from 'fs-extra'
import inquirer from 'inquirer';
import chalk from 'chalk';
import { spinner, pathExistsReject } from '../../utils/index';
import { custError } from '../../utils/error'

interface Params {
  path: string
}

type pluginFn = (params: Params) => Promise<any>

class RunCreat {

  // 插件
  static plugins: pluginFn[]

  // 模板地址
  tempUrl = path.resolve(__dirname, '../../template')

  // 模板列表
  tempList: string[] = []

  constructor(private params: Params) { }

  static add(fn: pluginFn) {
    RunCreat.plugins.push(fn)
  }

  async start() {
    this.tempList = await fs.readdir(this.tempUrl, { encoding: 'utf-8' })
    const answers = await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'projectName',
        message: '请选择代码片段',
        choices: [...this.tempList].map(v => (
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
    const targetUrl = path.resolve(process.cwd(), this.params.path, answers.fileName)
    await pathExistsReject(targetUrl)

    // copy
    const copy = async () => {
      const targetTempUrl = path.resolve(this.tempUrl, answers.projectName)
      const isTargetTempUrl = await fse.pathExists(targetTempUrl)
      if (!isTargetTempUrl) {
        throw custError('')
      }

      await fse.copy(targetTempUrl, targetUrl)

      // tip 创建完成
      spinner.succeed(`创建完成...\n`)
    }

    // run plugin
    for (let i = 0; i < RunCreat.plugins.length; i++) {
      await RunCreat.plugins[i](this.params)
    }

    // copy
    copy()

  }

}

export default RunCreat