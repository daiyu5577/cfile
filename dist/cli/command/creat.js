import path from 'path';
import fs from 'fs/promises';
import fse from 'fs-extra';
import { input, select } from '@inquirer/prompts';
import { spinner, pathExistsReject } from '../../utils/index.ts';
import { custError } from '../../utils/error.ts';
export const getUrl = (path) => new URL(path, import.meta.url);
const runCreat = async (params) => {
    // tip
    // spinner.start(`正在加载模板...\n`)
    const tempUrl = getUrl('../../template').pathname;
    const tempList = await fs.readdir(tempUrl, { encoding: 'utf-8' });
    // spinner.info(`模板加载完成\n`)
    const answers = {
        projectName: await select({
            message: '请选择代码片段',
            choices: [...tempList].map(v => ({
                name: v,
                value: v,
            }))
        }),
        fileName: await input({ message: "请输入文件名" }),
    };
    // tip 加载模板
    spinner.start(`开始创建模板...\n`);
    // check dir
    const targetUrl = path.resolve(process.cwd(), params.path, answers.fileName);
    await pathExistsReject(targetUrl);
    // copy
    const targetTempUrl = path.resolve(getUrl('../../template').pathname, answers.projectName);
    const isTargetTempUrl = await fse.pathExists(targetTempUrl);
    if (!isTargetTempUrl) {
        throw custError('');
    }
    await fse.copy(targetTempUrl, targetUrl);
    // tip 创建完成
    spinner.succeed(`创建完成...\n`);
};
export default runCreat;
