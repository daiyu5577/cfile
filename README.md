## 模板使用
  1. <b>代码片段使用</b>
    *  模板统一存放于 template 文件夹，文件命名方式为 项目名_目录1_目录2_标识（标识可自定义用于区分）
    * 模板使用 handlebars 语法，参考文档[handlebarsjs](https://handlebarsjs.com/)

## QA

#### package.json 配置 type=module， ts-node 执行.ts后缀文件异常，不支持.ts后缀文件
  - 使用 ts-node-esm 执行
  - ![stackoverflow](/asset/images/problem_tsnode.jpg)
