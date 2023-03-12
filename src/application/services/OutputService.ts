
export interface IOutputService {
    sendOutput(text: string, messageId: string): Promise<void>;
}