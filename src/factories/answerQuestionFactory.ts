import { ILoggerService } from "../application/services/LoggerService"
import { IRequestQueue } from "../application/services/RequestQueue"
import { AnswerQuestionUseCase } from "../application/usecases/answerQuestion"

export const answerQuestionFactory = (requestQueue: IRequestQueue, loggerService: ILoggerService ) => {
    return new AnswerQuestionUseCase(loggerService, requestQueue)
}