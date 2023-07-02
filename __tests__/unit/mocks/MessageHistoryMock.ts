import { IHistoryMessageByGuildService } from '@usecases/services/HistoryMessagesService'

export class MockMessageHistory implements IHistoryMessageByGuildService {
  getMessages(_guildId: string): Promise<{ role: string; content: string }[]> {
    return Promise.resolve([] as { role: string; content: string }[])
  }
  deleteMessagesHistory(_guildId: string): Promise<void> {
    return Promise.resolve()
  }
  addMessage(
    _guildId: string,
    _message: { role: string; content: string }
  ): Promise<void> {
    return Promise.resolve()
  }
}
