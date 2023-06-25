import { ConsoleAdapter } from "../infra/services/LogService/ConsoleAdapter"
import { OnJoinGuildUseCase } from "../usecases/OnJoinGuildUseCase"

export const OnJoinGuildUseCaseFactory = () => {
    const loggerService = new ConsoleAdapter()
    return new OnJoinGuildUseCase(loggerService)
}