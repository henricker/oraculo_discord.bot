import { describe, it } from '@jest/globals'
import { DeleteHistoryMessageUseCase } from '@usecases/DeleteHistoryMessageUseCase'
import { MockLoggerService } from '../mocks/LoggerServiceMock'
import { MockMessageHistory } from '../mocks/MessageHistoryMock'

const makeSut = () => {
  const loggerService = new MockLoggerService()
  const historyMessageService = new MockMessageHistory()
  const sut = new DeleteHistoryMessageUseCase(
    historyMessageService,
    loggerService
  )

  return { sut, loggerService, historyMessageService }
}

describe('#UseCase - DeleteHistoryMessageUseCase', () => {
  it('Should call loggerService if anything in execute method throws', async () => {
    const { sut, historyMessageService, loggerService } = makeSut()
    const mockedError = new Error('mocked error :p')
    jest
      .spyOn(historyMessageService, 'deleteMessagesHistory')
      .mockRejectedValueOnce(mockedError)

    const spy = jest.spyOn(loggerService, 'log')
    await sut.execute('guildId')
    expect(spy).toHaveBeenCalledWith(mockedError, 'error')
  })

  it('Should call historyMessageService.deleteMessagesHistory with correct guildId', async () => {
    const { sut, historyMessageService } = makeSut()
    const spy = jest.spyOn(historyMessageService, 'deleteMessagesHistory')
    await sut.execute('guildId')
    expect(spy).toHaveBeenCalledWith('guildId')
  })
})
