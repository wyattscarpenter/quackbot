import { REST, Routes } from "discord.js";
import * as process from "node:process";
import { secrets } from "./util";
import { commands } from "./commands";

const rest = new REST({ version: "10" }).setToken(secrets.token);
const commands_json = [];

const global_deploy: boolean = process.argv[2]?.toLowerCase() === "global";

for (const c of commands) {
  commands_json.push(c.data.toJSON());
}

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    if (global_deploy) {
      console.log("Registering commands in the GLOBAL scope");
      await rest.put(Routes.applicationCommands(secrets.clientId), {
        body: commands_json,
      });
    } else {
      console.log("Registering commands in the testing server only");

      await rest.put(
        Routes.applicationGuildCommands(secrets.clientId, secrets.guildId),
        { body: commands_json }
      );
    }
    console.log(`Successfully reloaded ${commands.length}  commands.`);
  } catch (error) {
    console.error(error);
  }
})();
