type Message = {
  role: string
  content: string
}

type Input = {
  guildId: string
  message: Message
}

export interface IHistoryMessageByGuildService {
  getMessages(guildId: string): Promise<Message[]>
  deleteMessagesHistory(guildId: string): Promise<void>
  addMessage(guildId: string, message: Message): Promise<void>
}
