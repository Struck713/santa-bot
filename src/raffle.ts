import { ChatInputCommandInteraction, Emoji, parseEmoji, SlashCommandBuilder,TextChannel,type CacheType,type Client, type CommandInteraction, type GuildMember, type Interaction, type PartialUser, type User } from "discord.js";
import type { Command } from "./command";
import * as Utils from "./utils";
import type { TextChange } from "typescript";

class Raffle {

  private creator: string;
  private snowflakes: string[] = [];

  constructor(private messageId: string, user: GuildMember) {
    this.creator = user.id;
  }

  get id() { return this.messageId };
  isCreator = (user: GuildMember) => this.creator === user.id;

  join = (user: User | PartialUser) => this.snowflakes.push(user.id);
  leave = (user: User | PartialUser) => {
    const toRemove = this.snowflakes.findIndex(val => val === user.id);
    if (toRemove != -1)
      this.snowflakes.splice(toRemove, 1);
  };

  draw = async (client: Client) => {

    const ids = [...this.snowflakes]; // clone

    for (const id of this.snowflakes) {
      const [ assigneeId, assigneeIndex ] = Utils.random(ids);
      const user = await Utils.getUserByID(client, id);
      const assignee = await Utils.getUserByID(client, assigneeId);
      ids.splice(assigneeIndex, 1);

      const dm = await user.createDM();
      dm.send(`You have been assigned to: ${assignee.toString()}!`);
    }
  }

}

export const raffles: Map<string, Raffle> = new Map();
const hasCreatedRaffle = (user: GuildMember) => [...raffles.values()].find(r => r.isCreator(user));

export default <Command>{
  data: new SlashCommandBuilder().setName("raffle")
      .setDescription("Create and manage a raffle.")
      .addSubcommand(x => x.setName("create").setDescription("Create a raffle."))
      .addSubcommand(x => x.setName("draw").setDescription("End the raffle and draw.")),
  execute: async (client: Client, user: GuildMember, interaction: ChatInputCommandInteraction) => {
    const options = interaction.options;
    const subcommand = options.getSubcommand();

    if (subcommand == "draw") {
      const raffle = hasCreatedRaffle(user);
      if (!raffle) {
        await interaction.followUp("You need to create a raffle to draw!");
        return;
      }

      await raffle.draw(client);
      raffles.delete(raffle.id);
      await interaction.followUp("Raffle was successfully drawn.");
      return;
    }

    if (subcommand == "create") {
      if (hasCreatedRaffle(user)) {
        await interaction.followUp("You have already created a raffle!");
        return;
      }

      if (!interaction.channel) {
        return;
      }

      const channel = client.channels.cache.get(interaction.channel.id) as TextChannel;
      const message = await channel.send(`${user.toString()} created a raffle. Click the :white_check_mark: to join!`)
      const raffle = new Raffle(message.id, user);
      raffles.set(message.id, raffle);
      await message.react("✅");

      await interaction.followUp(`Created a raffle with ID #${message.id}`);
      return;
    }

  },
}
