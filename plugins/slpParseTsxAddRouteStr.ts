// @ts-nocheck
import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk';
import RunCreat, { Params } from "../cli/command/creat";

export default async function slpParseTsxAddRoute(crtInst: RunCreat) {
  try {

    let routeFile = ''

    if (crtInst.targetUrl.includes('act/act-center')) {
      const matchPath = crtInst.targetUrl.match(/.+(?=\/act\/act-center)/g)[0]
      routeFile = matchPath + '/act/act-center/src/Router.tsx'
    }

    console.log('route_file_path: ', routeFile)

    const lazyTemp = `const ${crtInst.answers.fileName} = lazy(() => import('./pages/${crtInst.answers.fileName}/Home'))`
    const routeTemp = `<Route path="${crtInst.answers.fileName}/*" element={<${crtInst.answers.fileName} />} />`

    const file = await fs.readFile(path.resolve(routeFile), { encoding: 'utf-8' })
    const fileArr = file.split("\n")

    let lastLazy = -1
    let lastRoute = -1
    for (let i = fileArr.length - 1; i >= 0; i--) {
      const curLine = fileArr[i];
      !~lastLazy && /lazy\(.+\)/.test(curLine) && (lastLazy = i);
      !~lastRoute && /\<Route.+\/\>/.test(curLine) && (lastRoute = i);
    }

    if (!~lastLazy || !~lastRoute) return

    fileArr.splice(lastLazy + 1, 0, lazyTemp)
    fileArr.splice(lastRoute, 0, routeTemp)

    await fs.writeFile(routeFile, fileArr.join('\n'), { encoding: 'utf-8', flag: "w" })

  } catch (error) {
    console.error(chalk.red(`------PLUGIN-ERROR-slpParseTsxAddRouteStr------`))
    console.error(error)
  }

}