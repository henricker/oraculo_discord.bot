import { describe, it, jest } from '@jest/globals'
import { MockLoggerService } from '../mocks/LoggerServiceMock'
import { HandleCommandsUseCase } from '../../../src/usecases/HandleCommandsUseCase'
import { IMessage } from '../../../src/domain/IMessage'


const makeSut = () => {
    const loggerService = new MockLoggerService()
    const sut = new HandleCommandsUseCase(loggerService)
    return {
        sut,
        loggerService
    }
}

describe('#UseCase - HandleCommandsUseCase', () => {
    process.env.TEXT_CHANNEL_ORACULO = 'oráculo'
    process.env.CODE_DELIMITTER = '$'
    const defaultMessage = {
        author: {
            bot: false
        },
        channel: {
            name: process.env.TEXT_CHANNEL_ORACULO
        },
        content: `${process.env.CODE_DELIMITTER}c: message param`,
        reply: jest.fn()
    } as unknown as IMessage
    it('Should call logger service if anything throws in exec method', async () => {
        const { sut, loggerService } = makeSut()
        const mockedError = new Error('mocked')
        const spy = jest.spyOn(loggerService, 'log')
        jest.spyOn(sut, 'checkCodeMessage' as any).mockRejectedValueOnce(mockedError)
        await sut.execute(defaultMessage)
        expect(spy).toHaveBeenCalledWith(mockedError, 'error')
    })
    it('Should return exit command if channel.name is not oráculo channel or author of message is the bot itself', async () => {
        const { sut } = makeSut()
        const result = await sut.execute({
            ...defaultMessage,
            author: {
                bot: true
            },
            channel: {
                ...defaultMessage.channel,
                name: 'anything'
            }
        })
        expect(result).toStrictEqual({
            commandCode: 'exit',
        })
    })
    it('Should return exit command and reply with invalid format warning', async () => {
        const { sut } = makeSut()
        const spy = jest.spyOn(defaultMessage, 'reply')
        const result = await sut.execute({
            ...defaultMessage,
            content: 'message without delimiter'
        })
        expect(spy).toHaveBeenCalledWith(sut['invalidMessageFormat'])
        expect(result).toStrictEqual({
            commandCode: 'exit',
        })
    })
    it('Should return commandCode and text by correct input', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(defaultMessage)
        expect(result).toStrictEqual({
          commandCode: 'c',
          textWithoutCommandCode: 'message param',
        })
    })
})