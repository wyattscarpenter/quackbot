import path = require("path");
import filesystem = require("fs");

import {
  CommandInteraction,
  Client,
  Collection,
  SlashCommandBuilder,
} from "discord.js";

export interface SlashCommand {
  data: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;
  execute: (i: CommandInteraction) => Promise<void>;
}

export class QuackClient extends Client {
  commands: Collection<string, object> = new Collection();
}

export const rootDir = (() => {
  let checkDir: string = path.resolve(__dirname);
  const pathsep = path.sep;

  const fullPath = path.resolve(__dirname).split(pathsep).reverse();

  for (const _ of fullPath) {
    const dirContents = filesystem.readdirSync(checkDir);

    if (dirContents.includes("package.json")) {
      return checkDir;
    }
    checkDir = path.join(checkDir, "..");
  }

  throw new Error("Can't find the project root");
})();

export const dataPath = path.join(rootDir, "data");

export const imagePath = path.join(dataPath, "image-templates");
export const fontsPath = path.join(dataPath, "fonts");

export const secretPath = path.join(rootDir, "./secret.json");

export let secrets: {token: string; clientId: string; guildId: string;};
try{
  secrets = require(secretPath);
} catch (e) {
  console.log("Could not find ./secret.json, defaulting to a local version of quackbot that will not connect to any discord servers.");
  console.log("Original error:", e);
  secrets = {token: "LOCAL", clientId: "CLIENTLOCAL", guildId: "GUILDLOCAL"};
}
