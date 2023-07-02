import { IUseCase } from '@shared/protocols/IUseCase'

type Message = {
  role: string
  content: string
}

type Input = {
  guildId: string
  message: Message
}

export class HistoryMessagesUseCase implements IUseCase<Input, void> {
  public readonly guildHistoryMap = new Map<string, Message[]>()

  execute(input: Input): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
