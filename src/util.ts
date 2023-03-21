import path = require("path");
import filesystem = require("fs");

import {
  CommandInteraction,
  Client,
  Collection,
  SlashCommandBuilder,
  Message,
} from "discord.js";

export interface SlashCommand {
  data: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;
  execute: (i: CommandInteraction) => Promise<any>;
}

export class QuackClient extends Client {
  commands: Collection<string, object> = new Collection();
}

export const rootDir = (() => {
  let checkDir: string = path.resolve(".");
  const pathsep = path.sep;

  const fullPath = path.resolve(".").split(pathsep).reverse();

  for (const _ of fullPath) {
    const dirContents = filesystem.readdirSync(checkDir);

    if (dirContents.includes("package.json")) {
      return checkDir;
    }
    checkDir = path.join(checkDir, "..");
  }

  throw new Error("Can't find the project root");
})();

export const secretPath = path.join(rootDir, "./secret.json");
export const secrets = require(secretPath);
