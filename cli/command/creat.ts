import ora from 'ora';
import { input, select, confirm } from '@inquirer/prompts';


const spinner = ora()

const runCreat = async (params: { path: string }) => {

  // tip 加载模板
  // spinner.text = `正在加载模板...\n`
  // spinner.start()

  const answers = {
    projectName: await select({
      message: '请选择代码片段',
      choices: [
        {
          name: 'webSlpPage_act',
          value: 'webSlpPage_act',
        },
        {
          name: 'webSlpPage_tool',
          value: 'webSlpPage_tool',
        },
      ]
    }),
    firstName: await input({ message: "请输入需要生成文件的相对目录" }),
  };

  console.log(answers)
}

export default runCreat