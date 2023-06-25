import { ILoggerService } from '@usecases/services/LoggerService'

export class ConsoleAdapter implements ILoggerService {
  async log(log: any, type: 'error' | 'info' | 'warn'): Promise<void> {
    switch (type) {
      case 'error':
        console.error(log)
        break
      case 'info':
        console.info(log)
        break
      case 'warn':
        console.warn(log)
        break
      default:
        console.log(log)
        break
    }
  }
}
