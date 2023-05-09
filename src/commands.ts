import { SlashCommandBuilder, CommandInteraction } from "discord.js";

import { SlashCommand } from "./util";

import * as path from "node:path";
import * as fs from "node:fs";

const commands_extern = (() => {
  let _commands: Array<SlashCommand> = [];

  for (const dir of fs.readdirSync(__dirname, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
      continue;
    }

    const _commands_extern = require(path
      .join(__dirname, dir.name, "commands")
      .toString()).commands;

    if (!_commands_extern.length) {
      continue;
    }

    _commands = _commands.concat(_commands_extern);
  }

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
