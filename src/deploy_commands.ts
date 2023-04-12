import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { secrets } from "./util";
import { commands } from "./commands";

const rest = new REST({ version: "10" }).setToken(secrets.token);
const commands_json = [];

for (let c of commands) {
  commands_json.push(c.data.toJSON());
}
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(secrets.clientId, secrets.guildId),
      { body: commands_json }
    );
    console.log(`Successfully reloaded ${commands.length}  commands.`);
  } catch (error) {
    console.error(error);
  }
})();



