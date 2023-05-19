import { QuackClient, SlashCommand, secrets } from "./util";
import { commands } from "./commands";

import { Events, GatewayIntentBits, Interaction, CacheType, ChatInputCommandInteraction} from "discord.js";

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
  console.log(mock_command(our_args[0], our_args.slice(1)));
} else if ( secrets.token == "LOCAL" ) { //Local, non-discord route for testing and local use.
  console.log("You are in local mode. This is a little CLI.");
  //This uses a disturbingly large amount of code for a simple cli...
  const readline = require('node:readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '🦆! Enter a command, or (h)elp, (e)val, (q)uit> ',
  });

  rl.prompt();

  rl.on('line', (line: string) => {
    const i = line.indexOf(" ");
    if (i>=1) {
      mock_command(line.slice(0,i), line.slice(i+1));
    } else {
      mock_command(line, "");
    }
    rl.prompt();
  });
} else { //Standard route; connects to discord using secret token
  client.login(secrets.token);
}

async function mock_command(command_name: string, command_rest: string | string[]) {
  if (Array.isArray(command_rest)) { command_rest = command_rest.join(" "); }

  if ( ["h", "help", "(h)elp"].includes(command_name.toLowerCase()) ) {
    console.log("The quackbot commandline parser is very primitive. A space separates your command from the rest of the text supplied to your command, which will be provided to every option in the slash command. Here are all of the commands:");
    console.log(client.commands.keys());
    console.log("Commandline specials: (h)elp, (e)val, (q)uit.")
    console.log("Note that instead of using the quackbot commandline, you can simply provide a command as arguments on the parent commandline when invoking quackbot, and quackbot will run that command and then exit. For example, `npm start h` will display this message and exit.")
    if(command_rest){console.log("Help does not take arguments.");}
  } else if ( ["e", "eval", "(e)val"].includes(command_name.toLowerCase()) ) {
    eval(command_rest);
  } else if ( ["q", "quit", "(q)uit"].includes(command_name.toLowerCase()) ) {
    process.exit(0);
  } else {
    const interaction = {
      isChatInputCommand: ()=> true, options: {getString: (name: string)=> command_rest||null}, reply: console.log
    } as unknown as ChatInputCommandInteraction;

    const command = client.commands.get(command_name) as SlashCommand;

    if (!command) {
      console.error(`No command matching for ${command_name}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
    }
  }
}
