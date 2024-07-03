import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk';
import RunCreat, { Params } from "../cli/command/creat";

const includeRoutes = [
  {
    name: 'act_act-center_route',
    dirReg: /act\/act-center/,
    matchReg: /.+(?=\/act\/act-center)/g,
    routePath: '/act/act-center/src/Router.tsx'
  }
]
type IncludeRouteItem = typeof includeRoutes[number]

export default async function slpParseTsxAddRoute(crtInst: RunCreat) {
  try {

    let routeFile = ''
    let curRoute: IncludeRouteItem

    if (!includeRoutes.some(v => v.dirReg.test(crtInst.copyTargetPath))) {
      console.log(chalk.yellow(`当前仅支持：${includeRoutes.map(v => v.routePath).join('、')}的路由文件代码生成`))
      return
    }

    curRoute = includeRoutes.find(v => v.dirReg.test(crtInst.copyTargetPath)) as IncludeRouteItem

    const matchPath = crtInst.copyTargetPath.match(curRoute.matchReg)?.[0]
    routeFile = matchPath + curRoute.routePath

    console.log('route_file_path: ', routeFile)

    const lazyTemp = `const ${crtInst.answers.fileName} = lazy(() => import('./pages/${crtInst.answers.fileName}'))`
    const routeTemp = `<Route path="${crtInst.answers.fileName.toLowerCase()}/*" element={<${crtInst.answers.fileName} />} />`

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