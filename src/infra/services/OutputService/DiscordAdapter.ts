import { Client, TextChannel } from "discord.js";
import { IOutputService } from "../../../application/services/OutputService";


export class DiscordAdapter implements IOutputService {
    constructor(
        private readonly discordClient: Client
    ) {}

    async sendOutput(text: string, messageId: string): Promise<void> {
        const channel = await this.discordClient.channels.fetch(
            process.env.DISCORD_CHANNEL_ID as string
        ) as TextChannel

        const message = await channel.messages.fetch(messageId)

        if(text.length > 2000) {
            await message?.reply({
                files: [{
                    name: 'answer.md',
                    attachment: Buffer.from(text)
                }]
            })
            return
        }

        await message?.reply(text)
    }
}