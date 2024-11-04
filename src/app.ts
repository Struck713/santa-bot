import { Client, Events, GatewayIntentBits } from "discord.js";
import { token } from "../config.json"

import handler  from "./raffle";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Startup
client.once(Events.ClientReady, client => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Commands
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName == "raffle") {

        await interaction.deferReply();

        const command = interaction.command;
        if (!command) {
          // somethinf went really wrong
          return;
        }

        const guild = interaction.guild;
        if (!guild) {
          // no commands in DMs
          return;
        }

        const user = guild.members.cache.get(interaction.user.id);
        if (!user) {
          // somehow they're in a guild but not
          return;
        }

        await handler.execute(client, user, interaction);
      }
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log(`Logging out of ${client.user?.tag}.`);
    client.destroy();
    process.exit();
});

client.login(token);
