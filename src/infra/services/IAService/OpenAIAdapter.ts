import { OpenAIApi } from 'openai'
import { IAService } from "../../../usecases/services/IAService";

export class OpenIAAdapter implements IAService {
    constructor(
        private readonly openIAClient: OpenAIApi
    ) {}

    private readonly messageHistory = []

    async answerQuestion(question: string): Promise<string> {
         const completion = await this.openIAClient.createChatCompletion({
            messages: [{
                role: 'user',
                content: question
            }],
            model: 'gpt-3.5-turbo'
        })

        return completion?.data?.choices[0]?.message?.content as string
    }
}