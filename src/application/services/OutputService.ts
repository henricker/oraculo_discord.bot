
export interface IOutputService {
    sendOutput(text: string, messageId: string, guildId: string): Promise<void>;
}