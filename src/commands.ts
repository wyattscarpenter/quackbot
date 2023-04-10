import { SlashCommandBuilder, CommandInteraction } from "discord.js";

import { SlashCommand } from "./util";

import * as path from "node:path";
import * as fs from "node:fs";

import("node:fs");

const commands_extern = (() => {
  let _commands: Array<SlashCommand> = [];

  for (let dir of fs.readdirSync(".", { withFileTypes: true })) {
    console.log(dir.name);
    if (!dir.isDirectory()) {
      continue;
    }

    const _commands_extern = require("./" +
      path.join(dir.name, "commands.ts").toString()).commands;

    if (!_commands_extern.length){
      continue;
    }

    _commands = _commands.concat(_commands_extern);
  }

  console.log(_commands);
  return _commands;
})();

const local_commands: Array<SlashCommand> = [
  {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Reply with pong"),

    async execute(interaction: CommandInteraction) {
      await interaction.reply("Pong!");
    },
  },
];

export const commands = local_commands.concat(commands_extern);
