import {
  defineConfig
} from 'rollup';
import del from 'rollup-plugin-delete'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: 'main.ts',
  output: {
    dir: 'dist',
    format: "commonjs",
    preserveModules: true,
  },
  external: [/template/],
  plugins: [
    del({
      targets: 'dist/*'
    }),
    typescript(),
    commonjs(),
    terser()
  ]
});