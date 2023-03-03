import 'dotenv/config'
import { Configuration, OpenAIApi } from 'openai'
import { Client as ClientDiscord, GatewayIntentBits, TextChannel } from 'discord.js'


(async () => {
    const configuration = new Configuration({
        apiKey: process.env.OPEN_IA_API_KEY
    })
    
    const openai = new OpenAIApi(configuration)

    const discord =  new ClientDiscord({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
    })

    discord.on('ready', (discord) => {
        discord.on('messageCreate', async (message) => {
            try {
                const channelName = message.channel.toJSON() as { name: string }
    
                if(channelName.name !== process.env.DISCORD_CHANNEL_NAME) {
                    return
                }
                
                const channel = message.channel as TextChannel
        
                if(message.author.bot) {
                    return;
                }
    
                if(!message.content.match(/^\$question:.*$/)) {
                    await channel.send('Para realizar uma pergunta, utilize o comando: ```$question: <pergunta>```')
                    return;
                }
    
                const question = message.content.replace(/^\$question:/, '').trim()
    
                const completion = await openai.createChatCompletion({
                    messages: [{
                        role: 'user',
                        content: question
                    }],
                    model: 'gpt-3.5-turbo'
                })
    
                await message.reply(completion.data.choices[0].message?.content as string)
            } catch(err) {
                message.reply("Ops, ocorreu um erro ao tentar responder sua pergunta. Tente novamente mais tarde.")
            }

        })
    })
    discord.login(process.env.DISCORD_TOKEN)
})()

