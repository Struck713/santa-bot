import { SlashCommandBuilder,type Client, type CommandInteraction, type GuildMember, type User } from "discord.js";
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
  data: new SlashCommandBuilder().setName("raffle")
      .setDescription("Create and manage a raffle.")
      .addSubcommand(x => x.setName("create").setDescription("Create a raffle."))
      .addSubcommand(x => x.setName("draw").setDescription("End the raffle and draw.")),
  execute: async (client: Client, user: GuildMember, interaction: CommandInteraction) => {
    interaction.options.getSub
  },
}
