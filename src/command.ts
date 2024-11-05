import type { Client, GuildMember, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
export interface Command {
  execute: (client: Client, user: GuildMember, interaction: ChatInputCommandInteraction) => Promise<void>,
  data: SlashCommandBuilder
}
