import { OpenIAAdapter } from './infra/services/IAService/OpenAIAdapter'
import { Configuration, OpenAIApi } from 'openai'
import { queue } from './queue'

const configuration = new Configuration({
    apiKey: process.env.OPEN_IA_API_KEY
})

const openai = new OpenAIApi(configuration)

const iaService = new OpenIAAdapter(openai)

queue.on('error', (error) => {
    console.log(error)
})

queue.process(async (job) => {
    try {
        const { question } = job.data
        const answer = await iaService.answerQuestion(question)
        process.send?.({
            code: 'request-open-ia',
            data: {
                answer,
                messageId: job.data.messageId,
                guildId: job.data.guildId
            }
        })
    } catch(err: any) {
        if(err?.response?.status === 429) {
            await queue.add(job.data, {
                delay: 5000
            })
        }
    }
})

