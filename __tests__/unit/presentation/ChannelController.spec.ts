import { describe, it } from '@jest/globals';
import { AnswerQuestionUseCase } from '../../../src/application/usecases/answerQuestion';
import { ChannelController } from '../../../src/presentation/ChannelController';
import { MockLoggerService } from '../mocks/LoggerServiceMock';
import { MockOutputService } from '../mocks/OutputServiceMock';
import { MockRequestQueue } from '../mocks/MockRequestQueue';

const makeSut = () => {
    const outputService = new MockOutputService()
    const loggerService = new MockLoggerService()
    const requestQueue = new MockRequestQueue()
    const answerQuestionUseCase = new AnswerQuestionUseCase(
        loggerService,
        requestQueue
    )

    const sut = new ChannelController(answerQuestionUseCase, loggerService, outputService)

    return { sut, answerQuestionUseCase, outputService, loggerService }
}

describe('#Presentation - ChannelController', () => {
    process.env.CODE_DELIMITTER = '$'

    describe('#checkCodeMessage', () => {
        it('Should calls OutputService with correct message when message does not contains code delimitter', async () => {
            const { sut, outputService} = makeSut()
            const spy = jest.spyOn(outputService, 'sendOutput')
            await sut['checkCodeMessage']('any_message', 'any_message_id', 'any_guild_id')
            expect(spy).toHaveBeenCalledWith(`Formato da mensagem inválida, envie no seguinte formato: ${process.env.CODE_DELIMITTER}<code> <message>`, 'any_message_id', 'any_guild_id')
        })

        it('Should return void when message does not contains code delimitter', async () => {
            const { sut } = makeSut()
            const result = await sut['checkCodeMessage']('any_message', 'any_message_id', 'any_guild_id')
            expect(result).toBeUndefined()
        })

        it('Should return message and code when message contains code delimitter', async () => {
            const { sut } = makeSut()
            const result = await sut['checkCodeMessage'](`${process.env.CODE_DELIMITTER}code any_message`, 'any_message_id', 'any_guild_id')
            expect(result).toEqual({ message: 'any_message', code: 'code' })
        })
    })

    describe('#selectUseCaseByCode', () => {
        it('Should calls answerQuestionUseCase with correct message when code is q', async () => {
            const { sut, answerQuestionUseCase } = makeSut()
            const spy = jest.spyOn(answerQuestionUseCase, 'execute')
            await sut['selectUseCaseByCode']('q', 'any_message', 'any_message_id', 'any_guild_id')
            expect(spy).toHaveBeenCalledWith('any_message', 'any_message_id', 'any_guild_id')
        })

        it('Should calls OutputService with correct message when code is not q', async () => {
            const { sut, outputService } = makeSut()
            const spy = jest.spyOn(outputService, 'sendOutput')
            await sut['selectUseCaseByCode']('any_code', 'any_message', 'any_message_id', 'any_guild_id')
            expect(spy).toHaveBeenCalledWith('Comando inválido', 'any_message_id', 'any_guild_id')
        })
    })

    describe('#handle', () => {
        it('Should calls checkCodeMessage with correct message', async () => {
            const { sut } = makeSut()
            const spy = jest.spyOn(sut, 'checkCodeMessage' as any)
            await sut.handle('any_message', 'any_message_id', 'any_guild_id')
            expect(spy).toHaveBeenCalledWith('any_message', 'any_message_id', 'any_guild_id')
        })

        it('Should calls loggerService with correct error when checkCodeMessage throws', async () => {
            const { sut, loggerService } = makeSut()
            const spy = jest.spyOn(loggerService, 'log')
            jest.spyOn(sut, 'checkCodeMessage' as any).mockRejectedValueOnce(new Error('any_error'))
            await sut.handle('any_message', 'any_message_id', 'any_guild_id')
            expect(spy).toHaveBeenCalledWith(new Error('any_error'), 'error')
        })

        it('Should return void when checkCodeMessage returns void', async () => {
            const { sut } = makeSut()
            jest.spyOn(sut, 'checkCodeMessage' as any).mockResolvedValueOnce(void 0)
            const result = await sut.handle('any_message', 'any_message_id', 'any_guild_id')
            expect(result).toBeUndefined()
        })

        it('Should calls selectUseCaseByCode with correct code and message', async () => {
            const { sut } = makeSut()
            const spy = jest.spyOn(sut, 'selectUseCaseByCode' as any)
            jest.spyOn(sut, 'checkCodeMessage' as any).mockResolvedValueOnce({ message: 'any_message', code: 'any_code' })
            await sut.handle('any_message', 'any_message_id', 'any_guild_id')
            expect(spy).toHaveBeenCalledWith('any_code', 'any_message', 'any_message_id', 'any_guild_id')
        })

        it('Should calls LoggerService with correct error when selectUseCaseByCode throws', async () => {
            const { sut, loggerService } = makeSut()
            const spy = jest.spyOn(loggerService, 'log')
            jest.spyOn(sut, 'selectUseCaseByCode' as any).mockRejectedValueOnce(new Error('any_error'))
            await sut.handle(`${process.env.CODE_DELIMITTER}any_code any_message`, 'any_message_id', 'any_guild_id')
            expect(spy).toHaveBeenCalledWith(new Error('any_error'), 'error')
        })
    })
})