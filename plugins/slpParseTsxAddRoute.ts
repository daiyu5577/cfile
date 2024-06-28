// @ts-nocheck
import fs from 'fs/promises'
import path from 'path';
import RunCreat, { Params } from "../cli/command/creat";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import generate from "@babel/generator";
import template from "@babel/template";
import t from "@babel/types";

export default async function slpParseTsxAddRoute(crtInst: RunCreat) {

  const routeFile = path.resolve(__dirname, './Router.tsx')

  const lazyTemp = template(`
  const ${crtInst.answers.fileName} = lazy(() => import('./pages/${crtInst.answers.fileName}/Home'))
`)()
  const routeTemp = template(`
  \n<Route path="${crtInst.answers.fileName}/*" element={<${crtInst.answers.fileName} />} />\n
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
      lastJSXRouteNodePath?.insertAfter?.(routeTemp)
    }
  })

  const generateCode = generate(ast).code

  await fs.writeFile(routeFile, generateCode, { encoding: 'utf-8', flag: "w" })
}