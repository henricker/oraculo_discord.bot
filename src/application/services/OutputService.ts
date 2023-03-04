
export interface IOutputService {
    sendOutput(text: string): Promise<void>;
}