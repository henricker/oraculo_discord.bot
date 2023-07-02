export interface IAService {
  answerQuestion(history: { role: string; content: string }[]): Promise<string>
}
