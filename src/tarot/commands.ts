import { Card, drawCard, drawMajor, drawMinor } from "./tarot";

import { SlashCommand, rootDir } from "../util";
import path = require("node:path");

import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  CommandInteraction,
  AttachmentBuilder,
  Message,
  MessageCreateOptions
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
      .setName("Query")
      .setRequired(false)
      .setDescription("Ask a specific question")
  );

const execute = async (interaction: CommandInteraction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const deck = interaction.options.getString("deck") ?? "all";
  const drawnCard: Card = DecksMap.get(deck)();

  const card_image = new AttachmentBuilder(
    path.join(rootDir, "data/card-art/"),
    { name: drawnCard.image }
  );

  await interaction.reply(deck);
};

export const tarotCommand: SlashCommand = {
  data: tarotCommandData,
  execute: execute,
};
