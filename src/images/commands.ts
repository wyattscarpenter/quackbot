import { SlashCommand } from "../util";
import { MacroDefs, addImageText } from "./images";

import * as path from "node:path";

import {
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";

export const commands: Array<SlashCommand> = MacroDefs.map((macro) => {
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
