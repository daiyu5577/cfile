"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = slpParseTsxAddRoute;
// @ts-nocheck
const promises_1 = __importDefault(require("fs/promises"));
const chalk_1 = __importDefault(require("chalk"));
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
const generator_1 = __importDefault(require("@babel/generator"));
const template_1 = __importDefault(require("@babel/template"));
const includeRoutes = [
    {
        name: 'act_act-center_route',
        dirReg: /act\/act-center/,
        matchReg: /.+(?=\/act\/act-center)/g,
        routePath: '/act/act-center/src/Router.tsx'
    }
];
function slpParseTsxAddRoute(crtInst) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!crtInst.answers.isPageRoute)
            return;
        try {
            let routeFile = '';
            let curRoute;
            if (!includeRoutes.some(v => v.dirReg.test(crtInst.copyTargetPath))) {
                console.log(chalk_1.default.yellow(`当前仅支持：${includeRoutes.map(v => v.routePath).join('、')}的路由文件代码生成`));
                return;
            }
            curRoute = includeRoutes.find(v => v.dirReg.test(crtInst.copyTargetPath));
            const matchPath = (_a = crtInst.copyTargetPath.match(curRoute.matchReg)) === null || _a === void 0 ? void 0 : _a[0];
            routeFile = matchPath + curRoute.routePath;
            console.log('routeFile', routeFile);
            const lazyTemp = (0, template_1.default)(`
    const ${crtInst.answers.fileName} = lazy(() => import('./pages/${crtInst.answers.fileName}/Home'))
  `)();
            const routeTemp = (0, template_1.default)(`
    <Route path="${crtInst.answers.fileName}/*" element={<${crtInst.answers.fileName} />} />
  `, {
                plugins: ['jsx']
            })();
            const code = yield promises_1.default.readFile(routeFile, { encoding: 'utf-8' });
            const ast = (0, parser_1.parse)(code, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx']
            });
            let lastLazyNodePath = null;
            let lastJSXRouteNodePath = null;
            (0, traverse_1.default)(ast, {
                Program(path) {
                    var _a;
                    path.traverse({
                        VariableDeclaration(variablePath) {
                            variablePath.node.declarations.forEach((declaration) => {
                                var _a, _b, _c;
                                if (((_a = declaration === null || declaration === void 0 ? void 0 : declaration.init) === null || _a === void 0 ? void 0 : _a.type) == 'CallExpression' &&
                                    ((_c = (_b = declaration === null || declaration === void 0 ? void 0 : declaration.init) === null || _b === void 0 ? void 0 : _b.callee) === null || _c === void 0 ? void 0 : _c.name) == 'lazy') {
                                    lastLazyNodePath = variablePath;
                                }
                            });
                        },
                        JSXElement(JSXEmentPath) {
                            var _a;
                            if (((_a = JSXEmentPath.node.openingElement.name) === null || _a === void 0 ? void 0 : _a.name) == 'Route')
                                lastJSXRouteNodePath = JSXEmentPath;
                        }
                    });
                    lastLazyNodePath === null || lastLazyNodePath === void 0 ? void 0 : lastLazyNodePath.insertAfter(lazyTemp);
                    (_a = lastJSXRouteNodePath === null || lastJSXRouteNodePath === void 0 ? void 0 : lastJSXRouteNodePath.insertBefore) === null || _a === void 0 ? void 0 : _a.call(lastJSXRouteNodePath, routeTemp);
                }
            });
            const generateCode = (0, generator_1.default)(ast).code;
            yield promises_1.default.writeFile(routeFile, generateCode, { encoding: 'utf-8', flag: "w" });
        }
        catch (error) {
            console.error(chalk_1.default.red(`------PLUGIN-ERROR-slpParseTsxAddRoute------`));
            console.error(error);
        }
    });
}
