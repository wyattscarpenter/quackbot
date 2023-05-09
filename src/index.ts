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
if (secrets.token == "LOCAL") { //Local, non-discord route for testing and local use.
  console.log("You are in local mode. This is a little CLI.");
  //This uses a disturbingly large amount of code for a simple cli...
  const readline = require('node:readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '🦆! Enter a command, or q to quit> ',
  });

  rl.prompt();

  rl.on('line', (line: string) => {
    switch (line.trim()) {
      case 'q':
        rl.close();
        break;
      default:
        console.log(`Ideally, I would try to run the command '${line.trim()}' from this, but I haven't implemented that logic yet.`);
        break;
    }
    rl.prompt();
  }).on('close', () => {
    process.exit(0);
  });
} else { //Standard route; connects to discord using secret token
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
}