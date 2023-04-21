import { IRequestQueue, RequestQueueParams } from "../../../application/services/RequestQueue";
import { queue } from "../../../queue";

export class RedisQueueRequestAdapter implements IRequestQueue {
    constructor(
    ) {}

    private readonly requestQueue = queue

    async add(data: RequestQueueParams): Promise<void> {
        this.requestQueue.add(data)
    }
}