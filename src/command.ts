import type { CacheType, ChatInputCommandInteraction, Client, GuildMember, SlashCommandBuilder } from "discord.js";

type CommandInteraction = ChatInputCommandInteraction<CacheType>;
export interface Command {
  execute: (client: Client, user: GuildMember, interaction: CommandInteraction) => Promise<void>,
  data: SlashCommandBuilder
}
