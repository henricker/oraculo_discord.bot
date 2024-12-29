import './register'
import './env'
import { IMessage } from '@domain/IMessage'
import { handleCommandsUseCaseFactory } from '@factories/HandleCommandsUseCaseFactory'
import { OnJoinGuildUseCaseFactory } from '@factories/OnJoinGuildUseCaseFactory'
import { answerQuestionUseCaseFactory } from '@factories/AnswerQuestionUseCaseFactory'
import { Client as ClientDiscord, GatewayIntentBits } from 'discord.js'
import { DeleteHistoryMessageUseCaseFactory } from '@factories/DeleteHistoryMessageUseCaseFactory'

function bootstrap() {
  const discord = new ClientDiscord({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  })

  discord.on('ready', (discord) => {
    const answerQuestionUseCase = answerQuestionUseCaseFactory()
    const onJoinGuildUseCase = OnJoinGuildUseCaseFactory()
    const handleCommandsUseCase = handleCommandsUseCaseFactory()
    const deleteHistoryMessageUseCase = DeleteHistoryMessageUseCaseFactory()
    discord.on(
      'guildCreate',
      onJoinGuildUseCase.execute.bind(onJoinGuildUseCase) as any
    )
    discord.on('messageCreate', async (message) => {
      try {
        const { commandCode, textWithoutCommandCode } =
          await handleCommandsUseCase.execute(message as unknown as IMessage)
        switch (commandCode) {
          case 'q': {
            await answerQuestionUseCase.execute({
              message: message as unknown as IMessage,
              question: textWithoutCommandCode as string,
            })
            return
          }
          case 'd': {
            await deleteHistoryMessageUseCase.execute(
              (message as unknown as IMessage).guild.id
            )
            await message.reply(
              'Seu histórico de mensagens foi deletado com sucesso!'
            )
            return
          }
          case 'commands': {
            await message.reply(`
               🤖 - Comandos disponíveis:
               $q: <sua pergunta> (envia a pergunta para o oráculo e ele responde) 🗣
               $d: (deleta todas as mensagens do histórico de mensagens) ❌
               $commands: (Lista todos os comandos disponíveis) 📃
            `)
            return
          }
          case 'exit': {
            return
          }
          default: {
            await message.reply('Invalid code command')
            return
          }
        }
      } catch (err) {
        message.reply(
          'Ops, ocorreu um erro ao tentar responder sua pergunta. Tente novamente mais tarde.'
        )
      }
    })
  })
  discord.login(process.env.DISCORD_TOKEN)
}

bootstrap()
