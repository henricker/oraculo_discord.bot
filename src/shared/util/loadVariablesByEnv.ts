export function loadVarsByEnv(env: string) {
  return env === 'prod' ? '.env' : '.env.dev'
}
