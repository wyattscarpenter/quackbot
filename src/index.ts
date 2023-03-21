import { QuackClient, SlashCommand ,secrets } from "./util";
import { commands } from "./commands";

import {
  Events,
  REST,
  GatewayIntentBits,
  Collection,
  Interaction,
  CacheType,
} from "discord.js";

const client = new QuackClient({ intents: [GatewayIntentBits.Guilds] });

for (const c of commands) {
  client.commands.set(c.data.name, c);
}

client.on(Events.InteractionCreate, (i: Interaction<CacheType>) => {
  console.log(i);
});

client.on(
  Events.InteractionCreate,
  async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const subclient = interaction.client as QuackClient;

    const command = subclient.commands.get(
      interaction.commandName
    ) as SlashCommand;

    if (!command) {
      console.error(`No command matching for ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
    }
  }
);

client.once(Events.ClientReady, (c: any) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.login(secrets.token);
