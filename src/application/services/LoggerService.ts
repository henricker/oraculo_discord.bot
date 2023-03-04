

export interface ILoggerService {
    log(log: any, type: 'error' | 'info' | 'warn'): Promise<void>
}