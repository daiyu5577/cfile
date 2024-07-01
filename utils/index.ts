import fs from 'fs/promises'
import path from 'path';
import fse from 'fs-extra'
import ora from 'ora';
import { custError } from '../utils/error'

export const spinner = ora()

export const pathExistsReject = async (p: string) => {
  const isExists = await fse.pathExists(p)
  return isExists ? Promise.reject(custError(`${p} 已存在`)) : Promise.resolve(false)
}

interface DeepCopy {
  souecePath: string
  targetPath: string
  formatterFn?: (filePath: string) => Promise<string>
}
export const deepCopy = async (params: DeepCopy) => {
  let count = 0
  return new Promise((res, rej) => {
    const loopFn = async (params: DeepCopy) => {
      const { souecePath, targetPath, formatterFn } = params
      const readdirList = await fs.readdir(souecePath)

      if (!readdirList.length && count == 0) {
        res('done')
      }

      count += readdirList.length

      readdirList.forEach(async (v) => {
        const curFileSourcePath = path.join(souecePath, v)
        const curFileTargetPath = path.join(targetPath, v)
        const curFileStats = await fs.stat(curFileSourcePath)

        if (curFileStats.isDirectory()) {
          loopFn({ souecePath: curFileSourcePath, targetPath: curFileTargetPath, formatterFn }, res)
          count--
          return
        }

        if (formatterFn) {
          const str = await formatterFn(curFileSourcePath)
          await fs.writeFile(curFileTargetPath, str)
        } else {
          await fs.cp(curFileSourcePath, curFileTargetPath)
        }

        count--
        count == 0 && res('done')
      })
    }
    loopFn(params)
  })
}