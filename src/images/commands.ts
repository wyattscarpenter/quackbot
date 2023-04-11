import { SlashCommand } from "../util";
import { MacroDefs, addImageText } from "./images";
import { getYud } from "./yud";

import * as path from "node:path";

import {
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";

let _commands: Array<SlashCommand> = MacroDefs.map((macro) => {
  const macroCommandData = new SlashCommandBuilder()
    .setName(macro.name)
    .setDescription(
      `Generate an image macro for '${macro.name}' with the given caption`
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("text")
        .setRequired(true)
        .setDescription("The caption text")
    );

  const execute = async (interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const caption_text = interaction.options.getString("text") ?? "";
    console.log(caption_text);

    const generated_image_path = await addImageText(macro, caption_text);
    console.log(generated_image_path);

    const generated_image = new AttachmentBuilder(generated_image_path, {
      name: path.basename(generated_image_path),
    });

    await interaction.reply({ files: [generated_image] });
  };

  return { data: macroCommandData, execute: execute };
});

const yudCommand = (() => {
  const yudCommandData = new SlashCommandBuilder()
    .setName("yud")
    .setDescription("yud");

  const execute = async (interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const yud_path = await getYud();

    const yud_image = new AttachmentBuilder(yud_path, {
      name: path.basename(yud_path),
    });

    await interaction.reply({ files: [yud_image] });
  };

  return { data: yudCommandData, execute: execute };
})();

_commands.push(yudCommand);

export const commands = _commands;
