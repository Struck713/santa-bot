import { SlashCommandBuilder, type CacheType, type ChatInputCommandInteraction, type Client, type CommandInteraction, type GuildMember, type User } from "discord.js";
import type { Command } from "./command";

class Raffle {

  private snowflakes: string[] = [];

  constructor(private client: Client) {}

  join = (user: User) => this.snowflakes.push(user.id);
  leave = (user: User) => {
    const toRemove = this.snowflakes.findIndex(val => val === user.id);
    if (toRemove != -1)
      this.snowflakes.splice(toRemove, 1);
  };

  draw = async () => {
    for (const id in this.snowflakes) {
      const user = await this.client.users.fetch(id);
      const dm = await user.createDM();
      dm.send("This is a message.");
    }
  }

}

export default <Command>{
  execute: async (client: Client, user: GuildMember, interaction: CommandInteraction) => {
    await interaction.reply("This is a test");
  },
  data: new SlashCommandBuilder().setName("raffle")
}
