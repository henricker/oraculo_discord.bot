import { IOutputService } from '@usecases/services/OutputService'

export class MockOutputService implements IOutputService {
  sendOutput(text: string): Promise<void> {
    return Promise.resolve()
  }
}
