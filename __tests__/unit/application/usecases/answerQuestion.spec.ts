import { describe, it } from '@jest/globals'
import { AnswerQuestionUseCase } from '../../../../src/application/usecases/answerQuestion'
import { MockIAService } from '../../mocks/IAServiceMock'
import { MockLoggerService } from '../../mocks/LoggerServiceMock'
import { MockOutputService } from '../../mocks/OutputServiceMock'
import { MockRequestQueue } from '../../mocks/MockRequestQueue'

const makeSut = () => {
    const loggerService = new MockLoggerService()
    const requestQueue = new MockRequestQueue()
    const sut = new AnswerQuestionUseCase(loggerService, requestQueue)

    return { sut, requestQueue, loggerService }
}

describe('#UseCase - AnswerQuestion', () => {
    it('Should calls requestQueue with correct question', async () => {
        const { sut, requestQueue } = makeSut()
        const spy = jest.spyOn(requestQueue, 'add')
        await sut.execute('any_question', 'any_message_id', 'any_guild_id')
        expect(spy).toHaveBeenCalledWith({
             guildId: "any_guild_id",
            messageId: "any_message_id",
            question: "any_question",
        })
    })

    it('Should calls LoggerService with correct error when requestQueue throws', async () => {
        const { sut, loggerService, requestQueue } = makeSut()
        const spy = jest.spyOn(loggerService, 'log')
        jest.spyOn(requestQueue, 'add').mockImplementationOnce(() => { throw new Error('any_error') })
        await sut.execute('any_question', 'any_message_id', 'any_guild_id')
        expect(spy).toHaveBeenCalledWith(new Error('any_error'), 'error')
    })
})