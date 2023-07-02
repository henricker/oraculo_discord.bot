import { IAService } from '@usecases/services/IAService'

export class MockIAService implements IAService {
  answerQuestion(
    history: { role: string; content: string }[]
  ): Promise<string> {
    return Promise.resolve('this is a answer')
  }
}
