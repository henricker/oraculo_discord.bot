import { IAService } from "../../../src/application/services/IAService";

export class MockIAService implements IAService {
    answerQuestion(question: string): Promise<string> {
        return Promise.resolve('mocked message')
    }
}