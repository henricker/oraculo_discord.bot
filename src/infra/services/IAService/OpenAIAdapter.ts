import { IAService } from '@usecases/services/IAService'
import { ChatCompletionRequestMessage, OpenAIApi } from 'openai'

export class OpenIAAdapter implements IAService {
  constructor(private readonly openIAClient: OpenAIApi) {}

  async answerQuestion(
    history: { role: string; content: string }[]
  ): Promise<string> {
    const completion = await this.openIAClient.createChatCompletion({
      messages: history as ChatCompletionRequestMessage[],
      model: 'gpt-3.5-turbo',
    })

    return completion?.data?.choices[0]?.message?.content as string
  }
}
