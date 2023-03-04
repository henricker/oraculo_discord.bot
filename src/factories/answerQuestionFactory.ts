import { IAService } from "../application/services/IAService"
import { ILoggerService } from "../application/services/LoggerService"
import { IOutputService } from "../application/services/OutputService"
import { AnswerQuestionUseCase } from "../application/usecases/answerQuestion"

export const answerQuestionFactory = (outputService: IOutputService, iaService: IAService, loggerService: ILoggerService ) => {
    return new AnswerQuestionUseCase(outputService,iaService,loggerService)
}