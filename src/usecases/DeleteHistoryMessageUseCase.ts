import { IUseCase } from '@shared/protocols/IUseCase'
import { IHistoryMessageByGuildService } from './services/HistoryMessagesService'
import { ILoggerService } from './services/LoggerService'

export class DeleteHistoryMessageUseCase implements IUseCase<string, void> {
  constructor(
    private readonly historyMessageService: IHistoryMessageByGuildService,
    private readonly loggerService: ILoggerService
  ) {}
  async execute(guildId: string): Promise<void> {
    try {
      await this.historyMessageService.deleteMessagesHistory(guildId)
    } catch (err) {
      await this.loggerService.log(err, 'error')
    }
  }
}
