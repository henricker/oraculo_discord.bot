import path from 'path'
import { register } from 'tsconfig-paths'
import tsconfigjson from '../tsconfig.json'

register({
  baseUrl: path.resolve(__dirname, '..'),
  paths: tsconfigjson.compilerOptions.paths,
})
