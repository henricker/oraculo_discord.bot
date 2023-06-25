import { describe, it, expect, jest } from '@jest/globals'
import { OnJoinGuildUseCase } from '../../../src/usecases/OnJoinGuildUseCase'
import { MockLoggerService } from '../mocks/LoggerServiceMock'
import { IGuild } from '../../../src/domain/IGuild'
import { ITextChannel } from '../../../src/domain/ITextChannel'
import { EChannelType } from '../../../src/domain/constants/EChannelTypeEnum'


const makeSut =  () => {
    const loggerService = new MockLoggerService()
    const sut = new OnJoinGuildUseCase(loggerService)

    return {
        loggerService, 
        sut
    }
}

describe('#UseCase - OnJoinGuildUseCase', () => {
    const defaulttextChannel = {
        name: 'any_name_channel',
        send: jest.fn()
    } as ITextChannel

    const guildThrowabble = {
        id: '1' ,  
        channels: {
            cache: {
                find: jest.fn()
            },
            create: jest.fn()
        }
    } as IGuild

    const defaultGuild = {
        id: '1',
        channels: {
            cache: [defaulttextChannel.name],
            create: jest.fn()
        }
    } as IGuild


    it('Should call logger service if anything throws inside exectue method of usecase', async () => {
        const { loggerService, sut } = makeSut()
        const mockedError = new Error('mocked error :D')
        const spy = jest.spyOn(loggerService, 'log')
        jest.spyOn(guildThrowabble.channels.cache,'find').mockImplementationOnce(() => {
            throw mockedError
        })
        await sut.execute(guildThrowabble)
        expect(spy).toHaveBeenCalledWith(mockedError, 'error')
    })
    it('Should call find method of guild', async () => {
        const { sut } = makeSut()
        const spy= jest.spyOn(defaultGuild.channels.cache, 'find')
        await sut.execute(defaultGuild)
        expect(spy).toHaveBeenCalled()
    })
    it('Should create a new text channel if him was not found', async () => {
        process.env.TEXT_CHANNEL_ORACULO = 'any_name_channel'
        const { sut } = makeSut()
        jest.spyOn(defaultGuild.channels.cache, 'find').mockReturnValueOnce(null)
        const spy = jest.spyOn(defaultGuild.channels, 'create')
        await sut.execute(defaultGuild)
        expect(spy).toHaveBeenCalledWith({
            name: process.env.TEXT_CHANNEL_ORACULO,
            type: EChannelType.GuildText
        })
    })
    it('Should send welcome message to textChannel', async () => {
        const { sut } = makeSut()
        jest.spyOn(defaultGuild.channels.cache, 'find').mockReturnValueOnce(defaulttextChannel)
        const spy = jest.spyOn(defaulttextChannel, 'send')
        await sut.execute(defaultGuild)
        expect(spy).toHaveBeenCalledWith(sut['welcomeGuildMessage'])
    })
})