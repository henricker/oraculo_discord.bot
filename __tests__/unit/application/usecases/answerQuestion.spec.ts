import { describe, it } from '@jest/globals'
import { AnswerQuestionUseCase } from '../../../../src/application/usecases/answerQuestion'
import { MockIAService } from '../../mocks/IAServiceMock'
import { MockLoggerService } from '../../mocks/LoggerServiceMock'
import { MockOutputService } from '../../mocks/OutputServiceMock'

const makeSut = () => {
    const outputService = new MockOutputService()
    const iaService = new MockIAService()
    const loggerService = new MockLoggerService()
    const sut = new AnswerQuestionUseCase(outputService, iaService, loggerService)

    return { sut, outputService, iaService, loggerService }
}

describe('#UseCase - AnswerQuestion', () => {
    it('Should calls IAService with correct question', async () => {
        const { sut, iaService } = makeSut()
        const spy = jest.spyOn(iaService, 'answerQuestion')
        await sut.execute('any_question', 'any_message_id', 'any_guild_id')
        expect(spy).toHaveBeenCalledWith('any_question')
    })

    it('Should calls OutputService with correct answer', async () => {
        const { sut, outputService } = makeSut()
        const spy = jest.spyOn(outputService, 'sendOutput')
        await sut.execute('any_question', 'any_message_id', 'any_guild_id')
        expect(spy).toHaveBeenCalledWith('mocked message', 'any_message_id', 'any_guild_id')
    })

    it('Should calls LoggerService with correct error when IAService throws', async () => {
        const { sut, iaService, loggerService } = makeSut()
        const spy = jest.spyOn(loggerService, 'log')
        jest.spyOn(iaService, 'answerQuestion').mockImplementationOnce(() => { throw new Error('any_error') })
        await sut.execute('any_question', 'any_message_id', 'any_guild_id')
        expect(spy).toHaveBeenCalledWith(new Error('any_error'), 'error')
    })

    it('Should calls LoggerService with correct error when OutputService throws', async () => {
        const { sut, outputService, loggerService } = makeSut()
        const spy = jest.spyOn(loggerService, 'log')
        jest.spyOn(outputService, 'sendOutput').mockImplementationOnce(() => { throw new Error('any_error') })
        await sut.execute('any_question',  'any_message_id', 'any_guild_id')
        expect(spy).toHaveBeenCalledWith(new Error('any_error'), 'error')
    })
})