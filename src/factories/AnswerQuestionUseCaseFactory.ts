import memoryAdapter from '@infra/services/HistoryMessageByGuildService/MemoryAdapter'
import { OpenIAAdapter } from '@infra/services/IAService/OpenAIAdapter'
import { ConsoleAdapter } from '@infra/services/LogService/ConsoleAdapter'
import { AnswerQuestionUseCase } from '@usecases/AnswerQuestionUseCase'
import { Configuration, OpenAIApi } from 'openai'

export const answerQuestionUseCaseFactory = () => {
  const configuration = new Configuration({
    apiKey: process.env.OPEN_IA_API_KEY,
  })
  const openai = new OpenAIApi(configuration)
  const iaService = new OpenIAAdapter(openai)
  const loggerService = new ConsoleAdapter()
  return new AnswerQuestionUseCase(iaService, loggerService, memoryAdapter)
}
