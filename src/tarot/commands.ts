import { Card, drawCard, drawMajor, drawMinor, formatCardInfo } from "./tarot";

const { MessageAttachment } = require("discord.js");

import { SlashCommand, rootDir } from "../util";
import path = require("node:path");

import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  CommandInteraction,
  AttachmentBuilder,
} from "discord.js";

export const DecksMap = new Map();

DecksMap.set("major", drawMajor);
DecksMap.set("minor", drawMinor);
DecksMap.set("all", drawCard);

const tarotCommandData = new SlashCommandBuilder()
  .setName("tarot")
  .setDescription("Look into the future with the power of THE CARDS")
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName("deck")
      .setRequired(false)
      .setDescription(
        "Choose the deck to draw from (major or minor arcana). If unspecified, draw from the whole deck"
      )
      .addChoices(
        { name: "major", value: "major" },
        { name: "minor", value: "minor" }
      )
  )
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName("query")
      .setRequired(false)
      .setDescription("Ask a specific question")
  );

const execute = async (interaction: CommandInteraction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const deck = interaction.options.getString("deck") ?? "all";
  const drawnCard: Card = DecksMap.get(deck)();
  console.log(drawnCard);
  const message_text = formatCardInfo(drawnCard);

  const card_image_path = path.join(rootDir, "data/card-art/", drawnCard.image);
  console.log(card_image_path);

  const card_image = new AttachmentBuilder(card_image_path, {
    name: drawnCard.image,
  });

  console.log(card_image);

  await interaction.reply({ content: message_text, files: [card_image] });
};

export const commands: Array<SlashCommand> = [
  {
    data: tarotCommandData,
    execute: execute,
  },
];
