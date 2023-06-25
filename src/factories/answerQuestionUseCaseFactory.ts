import { Configuration, OpenAIApi } from 'openai'
import { AnswerQuestionUseCase } from '../usecases/answerQuestionUseCase'
import { OpenIAAdapter } from '../infra/services/IAService/OpenAIAdapter'
import { ConsoleAdapter } from '../infra/services/LogService/ConsoleAdapter'

export const answerQuestionUseCaseFactory = () => {
  const configuration = new Configuration({
    apiKey: process.env.OPEN_IA_API_KEY,
  })
  const openai = new OpenAIApi(configuration)
  const iaService = new OpenIAAdapter(openai)
  const loggerService = new ConsoleAdapter()
  return new AnswerQuestionUseCase(iaService, loggerService)
}
