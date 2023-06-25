import { IMessage } from "../domain/IMessage";
import { IUseCase } from "../domain/IUseCase"
import { IAService } from "./services/IAService"
import { ILoggerService } from "./services/LoggerService"

type Input = {
    question: string;
    message: IMessage
}
export class AnswerQuestionUseCase implements IUseCase<Input, void> {
    constructor(
        private readonly iaService: IAService,
        private readonly loggerService: ILoggerService
    ) {}

    async execute({ message, question }: Input): Promise<void> {
        try {
            const answer = await this.iaService.answerQuestion(question)
            await message.reply(answer)
        } catch(err: any) {
            await this.loggerService.log(err, 'error')
        }
    }
}