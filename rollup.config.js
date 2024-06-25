import {
  defineConfig
} from 'rollup';
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: 'main.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [typescript(), commonjs(), terser()]
});