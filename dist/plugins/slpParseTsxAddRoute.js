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
const path_1 = __importDefault(require("path"));
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
const generator_1 = __importDefault(require("@babel/generator"));
const template_1 = __importDefault(require("@babel/template"));
function slpParseTsxAddRoute(crtInst) {
    return __awaiter(this, void 0, void 0, function* () {
        const routeFile = path_1.default.resolve(__dirname, './Router.tsx');
        const lazyTemp = (0, template_1.default)(`
  const ${crtInst.answers.fileName} = lazy(() => import('./pages/${crtInst.answers.fileName}/Home'))
`)();
        const routeTemp = (0, template_1.default)(`
  \n<Route path="${crtInst.answers.fileName}/*" element={<${crtInst.answers.fileName} />} />\n
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
                (_a = lastJSXRouteNodePath === null || lastJSXRouteNodePath === void 0 ? void 0 : lastJSXRouteNodePath.insertAfter) === null || _a === void 0 ? void 0 : _a.call(lastJSXRouteNodePath, routeTemp);
            }
        });
        const generateCode = (0, generator_1.default)(ast).code;
        yield promises_1.default.writeFile(routeFile, generateCode, { encoding: 'utf-8', flag: "w" });
    });
}