import 'dotenv/config'
import { Configuration, OpenAIApi } from 'openai'
import { ChannelType, Client as ClientDiscord, GatewayIntentBits, TextChannel } from 'discord.js'
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

        discord.on('guildCreate', async (guild) => {
            // Create oráculo channel
            let channel = guild.channels.cache.find(channel => channel.name === 'oráculo') as TextChannel
            if(!channel) {
                channel = await guild.channels.create({
                    name: 'oráculo',
                    type: ChannelType.GuildText
                })
            }
            await channel.send('Olá, eu sou o Oráculo, e estou aqui para te ajudar a encontrar respostas para suas perguntas. Para começar, basta me enviar uma pergunta e eu irei tentar responder da melhor forma possível. :smile:')
        })

        discord.on('messageCreate', async (message) => {
            try {
                const channel = message.channel as TextChannel
                if(channel.name !== 'oráculo' || message.author.bot) {
                    return
                }
                const guildId = message.guild?.id
                const content = message.content.trim()
                await channelController.handle(content, message.id, guildId as string)
            } catch(err) {
                loggerService.log(err, 'error')
                message.reply("Ops, ocorreu um erro ao tentar responder sua pergunta. Tente novamente mais tarde.")
            }

        })
    })
    discord.login(process.env.DISCORD_TOKEN)
})()

