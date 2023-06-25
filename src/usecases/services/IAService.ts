export interface IAService {
  answerQuestion(question: string): Promise<string>
}
