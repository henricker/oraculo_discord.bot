import { ILoggerService } from "../../../src/usecases/services/LoggerService";

export class MockLoggerService implements ILoggerService {
    log(log: any, type: "error" | "info" | "warn"): Promise<void> {
        return Promise.resolve()
    }
}