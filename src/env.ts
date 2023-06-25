import { loadVarsByEnv } from '@shared/util/loadVariablesByEnv'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.resolve(
    __dirname,
    '..',
    loadVarsByEnv(process.env.NODE_ENV ?? 'prod')
  ),
}) as any
