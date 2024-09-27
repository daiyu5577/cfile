import path from 'path';
import fs from 'fs/promises'
import fse from 'fs-extra'
import inquirer from 'inquirer';
import chalk from 'chalk';
import { spinner, pathExistsReject, deepCopy } from '../../utils/index';
import { custError } from '../../utils/error'
import slpParseTsxAddRouteStr from '../../plugins/slpParseTsxAddRouteStr'

export interface Params {
  path: string
}

type pluginFn = (crtInst: RunCreat) => Promise<any>

class RunCreat {

  // 插件
  static plugins: pluginFn[] = []

  // 模板地址
  tempsDirPath = path.resolve(__dirname, '../../template')

  // 模板列表
  tempList: string[] = []

  // 选择结果
  answers = {
    targetTemp: '',
    fileName: '',
    isPageRoute: false
  }

  // 生成目标路径
  copyTargetPath: string = ''

  constructor(private params: Params) { }

  static add(fn: pluginFn) {
    RunCreat.plugins.push(fn)
    return this
  }

  async start() {
    this.tempList = await fs.readdir(this.tempsDirPath, { encoding: 'utf-8' })
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'targetTemp',
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
      },
      {
        type: 'confirm',
        name: 'isPageRoute',
        message: "是否页面路由？",
        default: false
      },
    ])
    this.answers = answers
    // tip 加载模板
    spinner.start(`开始创建模板...\n`)

    // check dir
    const copyTargetPath = path.resolve(process.cwd(), this.params.path, answers.fileName)
    this.copyTargetPath = copyTargetPath
    await pathExistsReject(copyTargetPath)

    // copy
    const copy = async () => {
      const chooseTempPath = path.resolve(this.tempsDirPath, answers.targetTemp)
      const isChooseTempPath = await fse.pathExists(chooseTempPath)
      if (!isChooseTempPath) {
        throw custError('')
      }

      // use fse.copy
      await fse.copy(chooseTempPath, copyTargetPath)

      // use deepCopy
      // await deepCopy({ souecePath: chooseTempPath, targetPath: copyTargetPath })

      // tip 创建完成
      spinner.succeed(`创建完成...\n`)
    }

    // run plugin
    for (let i = 0; i < RunCreat.plugins.length; i++) {
      await RunCreat.plugins[i](this)
    }

    // copy
    copy()

  }

}

// add plugin
RunCreat.add(slpParseTsxAddRouteStr)

export default RunCreat