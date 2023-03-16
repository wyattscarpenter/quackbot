import {REST, Routes} from 'discord.js';
import {secrets} from './util';
import {commands} from './commands';

const {token, clientId, guildId} = secrets;

const rest = new REST({version: '10'}).setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {body: commands}
    );

    //		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
