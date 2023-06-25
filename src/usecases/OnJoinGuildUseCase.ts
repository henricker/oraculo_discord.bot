import { ILoggerService } from "./services/LoggerService";
import { IUseCase } from "../domain/IUseCase";
import { IGuild } from "../domain/IGuild";
import { EChannelType } from "../domain/constants/EChannelTypeEnum";

type Input = IGuild
export class OnJoinGuildUseCase implements IUseCase<Input, void> {
    constructor(
        private readonly loggerService: ILoggerService
    ) {}

    private readonly welcomeGuildMessage = 'Olá, eu sou o Oráculo, e estou aqui para te ajudar a encontrar respostas para suas perguntas. Para começar, basta me enviar uma pergunta e eu irei tentar responder da melhor forma possível. :smile:'

    async execute(input: Input): Promise<void> {
        try {
            let textChannel = input.channels.cache.find((g: string) => g === process.env.TEXT_CHANNEL_ORACULO)
            if(!textChannel) {
                textChannel = await input.channels.create({
                    name: process.env.TEXT_CHANNEL_ORACULO!,
                    type: EChannelType.GuildText
                })
            }
            await textChannel?.send(this.welcomeGuildMessage)
        } catch(err) {
            await this.loggerService.log(err, 'error')
        }
    }
}