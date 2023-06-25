import { ITextChannel } from "./ITextChannel"
import { EChannelType } from "./constants/EChannelTypeEnum"
export interface IGuild {
    id: string
    channels: {
        create(input: {
            name: string,
            type: EChannelType
        }): Promise<ITextChannel>
        cache: {
            find(...params: any[]): ITextChannel | null
        }
    }
}