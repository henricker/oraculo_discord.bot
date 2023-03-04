import { IOutputService } from "../../../src/application/services/OutputService";

export class MockOutputService implements IOutputService {
    sendOutput(text: string): Promise<void> {
        return Promise.resolve()
    }
}