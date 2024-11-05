import { Client, Events, GatewayIntentBits } from "discord.js";
import { token } from "../config.json"

import handler, { raffles }  from "./raffle";

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions
]
});

// Startup
client.once(Events.ClientReady, client => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Commands
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName == "raffle") {

        await interaction.deferReply({ ephemeral: true });

        const guild = interaction.guild;
        if (!guild) {
          await interaction.followUp("Please only use commands in guilds!");
          return;
        }

        const user = guild.members.cache.get(interaction.user.id);
        if (!user) {
          await interaction.followUp("Somehow you're not apart of this guild?");
          return;
        }

        await handler.execute(client, user, interaction);
      }
    }
});

// Reactions
client.on(Events.MessageReactionAdd, (reaction, user) => {
  if (user.bot) return;

  const message = reaction.message;
  const raffle = raffles.get(message.id);
  if (!raffle) return;

  raffle.join(user);
})

client.on(Events.MessageReactionRemove, (reaction, user) => {
  if (user.bot) return;

  const message = reaction.message;
  const raffle = raffles.get(message.id);
  if (!raffle) return;

  raffle.leave(user);
})

// Graceful shutdown
process.on('SIGINT', () => {
    console.log(`Logging out of ${client.user?.tag}.`);
    client.destroy();
    process.exit();
});

client.login(token);
