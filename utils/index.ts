import fse from 'fs-extra'
import ora from 'ora';
import { custError } from '../utils/error.ts'

export const spinner = ora()

export const pathExistsReject = async (p: string) => {
  const isExists = await fse.pathExists(p)
  return isExists ? Promise.reject(custError(`${p} 已存在`)) : Promise.resolve(false)
}