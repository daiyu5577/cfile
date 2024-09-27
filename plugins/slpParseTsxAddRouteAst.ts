// @ts-nocheck
import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk';
import RunCreat, { Params } from "../cli/command/creat";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import generate from "@babel/generator";
import template from "@babel/template";
import t from "@babel/types";

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

  if (!crtInst.answers.isPageRoute) return

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

    console.log('routeFile', routeFile)

    const lazyTemp = template(`
    const ${crtInst.answers.fileName} = lazy(() => import('./pages/${crtInst.answers.fileName}/Home'))
  `)()
    const routeTemp = template(`
    <Route path="${crtInst.answers.fileName}/*" element={<${crtInst.answers.fileName} />} />
  `, {
      plugins: ['jsx']
    })()

    const code = await fs.readFile(routeFile, { encoding: 'utf-8' })

    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    })

    let lastLazyNodePath: NodePath<t.VariableDeclaration> | null = null
    let lastJSXRouteNodePath: any = null
    traverse(ast, {
      Program(path) {
        path.traverse({
          VariableDeclaration(variablePath) {
            variablePath.node.declarations.forEach((declaration) => {
              if (
                declaration?.init?.type == 'CallExpression' &&
                declaration?.init?.callee?.name == 'lazy'
              ) {
                lastLazyNodePath = variablePath
              }
            });
          },
          JSXElement(JSXEmentPath) {
            if (JSXEmentPath.node.openingElement.name?.name == 'Route')
              lastJSXRouteNodePath = JSXEmentPath
          }
        })
        lastLazyNodePath?.insertAfter(lazyTemp)
        lastJSXRouteNodePath?.insertBefore?.(routeTemp)
      }
    })

    const generateCode = generate(ast).code

    await fs.writeFile(routeFile, generateCode, { encoding: 'utf-8', flag: "w" })

  } catch (error) {
    console.error(chalk.red(`------PLUGIN-ERROR-slpParseTsxAddRoute------`))
    console.error(error)
  }

}