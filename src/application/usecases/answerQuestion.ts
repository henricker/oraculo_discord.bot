import { IAService } from "../services/IAService"
import { ILoggerService } from "../services/LoggerService"
import { IOutputService } from "../services/OutputService"

export class AnswerQuestionUseCase {
    constructor(
        private readonly outputService: IOutputService,
        private readonly iaService: IAService,
        private readonly loggerService: ILoggerService
    ) {}

    async execute(question: string, messageId: string): Promise<void> {
        try {
            const answer = await this.iaService.answerQuestion(question)
            await this.outputService.sendOutput(answer, messageId)
        } catch(err: any) {
            await this.loggerService.log(err, 'error')
        }
    }
}