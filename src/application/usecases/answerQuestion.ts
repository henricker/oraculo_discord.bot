import { ILoggerService } from "../services/LoggerService"
import { IRequestQueue } from "../services/RequestQueue"

export class AnswerQuestionUseCase {
    constructor(
        private readonly loggerService: ILoggerService,
        private readonly requestQueue: IRequestQueue
    ) {}

    async execute(question: string, messageId: string, guildId: string): Promise<void> {
        try {
            await this.requestQueue.add({ question, messageId, guildId })
        } catch(err: any) {
            await this.loggerService.log(err, 'error')
        }
    }
}