import { IHistoryMessageByGuildService } from '@usecases/services/HistoryMessagesService'

type Message = {
  role: string
  content: string
}

type Input = {
  guildId: string
  message: Message
}

export class MemoryHistoryMessagesByGuildAdapter
  implements IHistoryMessageByGuildService
{
  private readonly historyGuild: Map<string, Message[]> = new Map()
  private readonly maxMessagesGuild = 50

  getMessages(guildId: string): Promise<Message[]> {
    return Promise.resolve(this.historyGuild.get(guildId) as Message[])
  }
  deleteMessagesHistory(guildId: string): Promise<void> {
    this.historyGuild.delete(guildId)
    return Promise.resolve()
  }
  addMessage(
    guildId: string,
    message: { role: string; content: string }
  ): Promise<void> {
    const guildMessages = this.historyGuild.get(guildId)

    if (!guildMessages) {
      this.historyGuild.set(guildId, [message])
      return Promise.resolve()
    }

    if (guildMessages.length + 1 > this.maxMessagesGuild) {
      this.historyGuild.set(guildId, [message])
      return Promise.resolve()
    }

    guildMessages.push(message)
    this.historyGuild.set(guildId, guildMessages)
    return Promise.resolve()
  }
}

export default new MemoryHistoryMessagesByGuildAdapter()
