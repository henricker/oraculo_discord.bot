import { IAService } from "../../../src/usecases/services/IAService";

export class MockIAService implements IAService {
    answerQuestion(question: string): Promise<string> {
        return Promise.resolve('mocked message')
    }
}