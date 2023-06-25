import { ConsoleAdapter } from '@infra/services/LogService/ConsoleAdapter'
import { HandleCommandsUseCase } from '@usecases/HandleCommandsUseCase'

export const handleCommandsUseCaseFactory = () => {
  const loggerService = new ConsoleAdapter()
  return new HandleCommandsUseCase(loggerService)
}
