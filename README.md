## 模板使用
  1. <b>代码片段使用</b>
    *  模板统一存放于 template 文件夹，文件命名方式为 项目名_目录1_目录2_标识（标识可自定义用于区分）
    * 模板使用 handlebars 语法，参考文档[handlebarsjs](https://handlebarsjs.com/)

## QA

#### package.json 配置 type=module， ts-node 执行.ts后缀文件异常，不支持.ts后缀文件
  - 使用 ts-node-esm 执行
  - ![stackoverflow](/asset/images/problem_tsnode.jpg)

### 使用 TS + ESM 模块注意事项
  -  package.json 默认 CommonJS， 设置 "type": "module" 标识 Node 以 ESM 规范（import、export）来运行当前项目，项目加载依赖使用 <code>import foo from 'foo'</code> 而不是 <code>const foo = require('foo')</code> 来导入包
  -  使用 ts-node 运行代码、ESM 规范需要用 ts-node-esm 运行
  -  将 package.json 中的 "engines" 字段更新为 Node.js 18: "node": ">=18"。
  -  仅使用完整的相对文件路径进行导入：<code>import x from '.'</code>，<code>import x from './index.js'</code>
  -  typescript 中的 config.json 配置
     -  若使用旧的 CommonJS 规范，则 “module”=“CommonJS” 生成代码的模块类型，“moduleResolution”=“Node” 包模块寻找方式
     -  使用 ESM 规范 “module”=“Node16”、“moduleResolution”=“Node16”，或者更新的 NodeNext
  - 使用 tsx 编译时
    - 使用新的ESM解析规范、import 引入需要带上文件后缀，使用 .ts 后缀，编译不会转换为 .js，可直接使用 .js 后缀。
  - 使用 CommonJS 规范时、依赖吧包需要使用 CommonJS 规范的版本
  - [详细参考](./esm-package.md)
