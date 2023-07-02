import { describe, it } from '@jest/globals'
import { AnswerQuestionUseCase } from '@usecases/AnswerQuestionUseCase'
import { IMessage } from '@domain/IMessage'
import { MockIAService } from '../mocks/IAServiceMock'
import { MockLoggerService } from '../mocks/LoggerServiceMock'
import { MockMessageHistory } from '../mocks/MessageHistoryMock'

const makeSut = () => {
  const iaService = new MockIAService()
  const loggerService = new MockLoggerService()
  const historyMessageService = new MockMessageHistory()
  const sut = new AnswerQuestionUseCase(
    iaService,
    loggerService,
    historyMessageService
  )

  return { sut, iaService, loggerService, historyMessageService }
}

describe('#UseCase - AnswerQuestionUseCase', () => {
  const defaultParams = {
    message: {
      guild: {
        id: 'mocked guild id',
      },
      reply: jest.fn(),
    } as unknown as IMessage,
    question: 'this is a question?',
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
    const { iaService, sut, historyMessageService } = makeSut()
    const spy = jest.spyOn(iaService, 'answerQuestion')
    jest.spyOn(historyMessageService, 'getMessages').mockResolvedValueOnce([
      {
        role: 'user',
        content: defaultParams.question,
      },
    ])
    await sut.execute(defaultParams)
    expect(spy).toHaveBeenCalledWith([
      { content: 'this is a question?', role: 'user' },
    ])
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
