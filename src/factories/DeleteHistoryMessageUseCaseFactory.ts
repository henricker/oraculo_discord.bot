import memoryAdapter from '@infra/services/HistoryMessageByGuildService/MemoryAdapter'
import { ConsoleAdapter } from '@infra/services/LogService/ConsoleAdapter'
import { DeleteHistoryMessageUseCase } from '@usecases/DeleteHistoryMessageUseCase'

export const DeleteHistoryMessageUseCaseFactory = () => {
  const loggerService = new ConsoleAdapter()
  return new DeleteHistoryMessageUseCase(memoryAdapter, loggerService)
}
