import 'dotenv/config'
import { Configuration, OpenAIApi } from 'openai'
import { Client as ClientDiscord, GatewayIntentBits } from 'discord.js'
import { DiscordAdapter } from './infra/services/OutputService/DiscordAdapter'
import { OpenIAAdapter } from './infra/services/IAService/OpenAIAdapter'
import { ConsoleAdapter } from './infra/services/LogService/ConsoleAdapter'
import { answerQuestionFactory } from './factories/answerQuestionFactory'
import { ChannelController } from './presentation/ChannelController'


(async () => {
    const configuration = new Configuration({
        apiKey: process.env.OPEN_IA_API_KEY
    })
    
    const openai = new OpenAIApi(configuration)

    const discord =  new ClientDiscord({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
    })

    discord.on('ready', (discord) => {
        const outputService = new DiscordAdapter(discord)
        const iaService = new OpenIAAdapter(openai)
        const loggerService = new ConsoleAdapter()

        const answerQuestion = answerQuestionFactory(outputService, iaService, loggerService)
        const channelController = new ChannelController(answerQuestion, loggerService, outputService)

        discord.on('messageCreate', async (message) => {
            try {
                if(message.channel.id !== process.env.DISCORD_CHANNEL_ID || message.author.bot) {
                    return
                }
                const content = message.content.trim()
                await channelController.handle(content)
            } catch(err) {
                loggerService.log(err, 'error')
                message.reply("Ops, ocorreu um erro ao tentar responder sua pergunta. Tente novamente mais tarde.")
            }

        })
    })
    discord.login(process.env.DISCORD_TOKEN)
})()

