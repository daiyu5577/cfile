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
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
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
            console.log('route_file_path: ', routeFile);
            const lazyTemp = `const ${crtInst.answers.fileName} = lazy(() => import('./pages/${crtInst.answers.fileName}/Home'))`;
            const routeTemp = `<Route path="${crtInst.answers.fileName}/*" element={<${crtInst.answers.fileName} />} />`;
            const file = yield promises_1.default.readFile(path_1.default.resolve(routeFile), { encoding: 'utf-8' });
            const fileArr = file.split("\n");
            let lastLazy = -1;
            let lastRoute = -1;
            for (let i = fileArr.length - 1; i >= 0; i--) {
                const curLine = fileArr[i];
                !~lastLazy && /lazy\(.+\)/.test(curLine) && (lastLazy = i);
                !~lastRoute && /\<Route.+\/\>/.test(curLine) && (lastRoute = i);
            }
            if (!~lastLazy || !~lastRoute)
                return;
            fileArr.splice(lastLazy + 1, 0, lazyTemp);
            fileArr.splice(lastRoute, 0, routeTemp);
            yield promises_1.default.writeFile(routeFile, fileArr.join('\n'), { encoding: 'utf-8', flag: "w" });
        }
        catch (error) {
            console.error(chalk_1.default.red(`------PLUGIN-ERROR-slpParseTsxAddRouteStr------`));
            console.error(error);
        }
    });
}
