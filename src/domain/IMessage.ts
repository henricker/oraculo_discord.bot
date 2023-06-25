import { IGuild } from "./IGuild";
import { ITextChannel } from "./ITextChannel";

export interface IMessage {
    channel: ITextChannel
    author: {
        bot: boolean
    }
    guild: IGuild
    content: string
    reply: (message: string) => Promise<void>
}