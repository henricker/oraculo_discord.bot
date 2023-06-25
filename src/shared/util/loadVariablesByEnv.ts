export function loadVarsByEnv(env?: string) {
  return env === 'production' ? '.env' : '.env.dev'
}
