import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { secrets } from "./util";
import { commands } from "./commands";

const rest = new REST({ version: "10" }).setToken(secrets.token);

const commands_json = [];

for (let c of commands) {
  commands_json.push(c.data.toJSON());
}

console.log(commands_json);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(secrets.clientId, secrets.guildId),
      { body: commands_json }
    );

    console.log(
      `Successfully reloaded ${commands.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
