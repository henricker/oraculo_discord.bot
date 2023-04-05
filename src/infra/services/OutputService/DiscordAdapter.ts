import { Client, TextChannel } from "discord.js";
import { IOutputService } from "../../../application/services/OutputService";

const CHANNEL_NAME = 'oráculo'
export class DiscordAdapter implements IOutputService {
    constructor(
        private readonly discordClient: Client
    ) {}

    async sendOutput(text: string, messageId: string, guildid: string): Promise<void> {
        const guild = await this.discordClient.guilds.fetch(guildid)
        const channelByGuild = guild.channels.cache.find(channel => channel.name === CHANNEL_NAME) as TextChannel
        const message = await channelByGuild?.messages.fetch(messageId)
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