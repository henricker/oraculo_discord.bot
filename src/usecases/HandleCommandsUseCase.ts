import { IMessage } from '@domain/IMessage'
import { IUseCase } from '@shared/protocols/IUseCase'
import { ILoggerService } from './services/LoggerService'

type Input = IMessage
type CommandCode = 'q' | 'd' | 'exit' | 'commands'
type Output = {
  commandCode: CommandCode
  textWithoutCommandCode?: string
}

export class HandleCommandsUseCase implements IUseCase<Input, Output> {
  constructor(private readonly loggerService: ILoggerService) {}

  private readonly codeDelimiter = process.env.CODE_DELIMITTER as string
  private readonly oraculoTextChannel = process.env
    .TEXT_CHANNEL_ORACULO as string
  public readonly invalidMessageFormat = `Formato da mensagem inválida, envie no seguinte formato: ${process.env.CODE_DELIMITTER}<code> <message>`

  async execute(input: Input): Promise<Output> {
    try {
      const { channel } = input
      if (channel.name !== this.oraculoTextChannel || input.author.bot) {
        return { commandCode: 'exit' }
      }
      return await this.checkCodeMessage(input)
    } catch (err) {
      await this.loggerService.log(err, 'error')
      return { commandCode: 'exit' }
    }
  }

  private async checkCodeMessage(input: Input): Promise<Output> {
    if (!input.content.includes(this.codeDelimiter)) {
      await input.reply(this.invalidMessageFormat)
      return { commandCode: 'exit' }
    }
    const [codeDelimiter, ...rest] = input.content.split(' ')
    const message = rest.join(' ')
    const code = codeDelimiter.replace(
      new RegExp(`[\\s${this.codeDelimiter}:]+`, 'g'),
      ''
    ) as CommandCode
    return { commandCode: code, textWithoutCommandCode: message }
  }
}
