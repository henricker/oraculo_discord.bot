export type RequestQueueParams = {
    question: string
    messageId: string
    guildId: string
}

export interface IRequestQueue {
    add(data: RequestQueueParams): Promise<void>
}