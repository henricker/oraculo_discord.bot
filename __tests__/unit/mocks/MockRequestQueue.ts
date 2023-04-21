import { IRequestQueue, RequestQueueParams } from "../../../src/application/services/RequestQueue";

export class MockRequestQueue implements IRequestQueue {
    add(data: RequestQueueParams): Promise<void> {
        return Promise.resolve()
    }
}