import { QuackClient, SlashCommand ,secrets } from "./util";
import { commands } from "./commands";

import { Events, REST, GatewayIntentBits, Collection, Interaction, CacheType, ChatInputCommandInteraction} from "discord.js";

const client = new QuackClient({ intents: [GatewayIntentBits.Guilds] });
const our_args = process.argv.slice(2);

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

// This is where we either login for real or just stay local. It must be after the other client-setup because if run with command-line arguments, we wish to immediately run a command, so that stuff must be defined.
if (our_args[0]) { // [] is not actually falsy, so we have to check the first element to see if it exists or is undefined.
  //run just one command
  console.log(mock_command(our_args[0], ...our_args.slice(1)));
} else if ( secrets.token == "LOCAL" ) { //Local, non-discord route for testing and local use.
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
    if (line.trim() == 'q'){
      rl.close();
    } else {
      const line_split = line.split(" ");
      mock_command(line_split[0], ...line_split.slice(1));
    }
    rl.prompt();
  }).on('close', () => {
    process.exit(0); //This seems rather inelegant. Oh well.
  });
} else { //Standard route; connects to discord using secret token
  client.login(secrets.token);
}

async function mock_command(commandName: string, ...command_rest: string[]) {
  const fake_user = {id: 1}
  const interaction = {
    isChatInputCommand: ()=> true, options: {getString: (name: string)=> command_rest.join(" ")||null}, reply: console.log
  } as unknown as ChatInputCommandInteraction;

  const command = client.commands.get(
    commandName
  ) as SlashCommand;

  if (!command) {
    console.error(`No command matching for ${commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
}
