import {
  Message,
  SlashCommandBuilder,
  Interaction,
  CommandInteraction,
} from "discord.js";

import { SlashCommand } from "./util";

import { tarotCommand as tc } from "./tarot/commands";
export const commands: Array<SlashCommand> = [
  {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Reply with pong"),

    async execute(interaction: CommandInteraction) {
      await interaction.reply("Pong!");
    },
  },

  tc,
];
