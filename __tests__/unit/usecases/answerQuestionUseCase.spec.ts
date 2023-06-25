import { describe, it } from '@jest/globals'
import { MockLoggerService } from '../mocks/LoggerServiceMock'
import { MockIAService } from '../mocks/IAServiceMock'
import { AnswerQuestionUseCase } from '../../../src/usecases/answerQuestionUseCase'
import { IMessage } from '../../../src/domain/IMessage'


const makeSut = () => {
    const iaService = new MockIAService()
    const loggerService = new MockLoggerService()
    const sut = new AnswerQuestionUseCase(iaService, loggerService)

    return { sut, iaService, loggerService }
}

describe('#UseCase - AnswerQuestionUseCase', () => {
    const defaultParams = {
        message: {
            reply: jest.fn()
        } as  unknown as IMessage,
        question: 'this is a question?'
    }
    it('Should call loggerService if anything throws in execute method', async () => {
      const { iaService, loggerService, sut } = makeSut()
      const mockedError = new Error('any error')
      jest.spyOn(iaService, 'answerQuestion').mockRejectedValueOnce(mockedError)
      const spy = jest.spyOn(loggerService, 'log')
      await sut.execute(defaultParams)
      expect(spy).toHaveBeenCalledWith(mockedError, 'error')
    })

    it('Should call iaService with correct question', async () => {
        const { iaService, sut } = makeSut()
        const spy = jest.spyOn(iaService, 'answerQuestion')
        await sut.execute(defaultParams)
        expect(spy).toHaveBeenCalledWith(defaultParams.question)
    })

    it('Should reply message on success', async () => {
        const { iaService, sut } = makeSut()
        const spy = jest.spyOn(defaultParams.message, 'reply')
        const answerMocked = 'this is a answer'
        jest.spyOn(iaService, 'answerQuestion').mockResolvedValueOnce(answerMocked)
        await sut.execute(defaultParams)
        expect(spy).toHaveBeenCalledWith(answerMocked)
    })
})