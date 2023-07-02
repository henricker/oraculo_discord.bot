import { IMessage } from '@domain/IMessage'
import { IUseCase } from '@shared/protocols/IUseCase'
import { IAService } from './services/IAService'
import { ILoggerService } from './services/LoggerService'
import { IHistoryMessageByGuildService } from './services/HistoryMessagesService'

type Input = {
  question: string
  message: IMessage
}
export class AnswerQuestionUseCase implements IUseCase<Input, void> {
  constructor(
    private readonly iaService: IAService,
    private readonly loggerService: ILoggerService,
    private readonly historyMessageService: IHistoryMessageByGuildService
  ) {}

  async execute({ message, question }: Input): Promise<void> {
    try {
      this.historyMessageService.addMessage(message.guild.id, {
        role: 'user',
        content: question,
      })
      const answer = await this.iaService.answerQuestion(
        await this.historyMessageService.getMessages(message.guild.id)
      )
      this.historyMessageService.addMessage(message.guild.id, {
        role: 'assistant',
        content: answer,
      })
      await message.reply(answer)
    } catch (err: any) {
      await this.loggerService.log(err, 'error')
    }
  }
}
