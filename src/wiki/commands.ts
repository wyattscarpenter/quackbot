import { SlashCommand } from "../util";
import { getWikiSummary, WikipediaSummary } from "./wiki";
import {
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
  SlashCommandStringOption,
} from "discord.js";

const make_embed = (data: WikipediaSummary): EmbedBuilder => {
  const embed = new EmbedBuilder()
    .setTitle(data.title)
    .setDescription(data.summary)
    .setURL(data.url);

  if (data.mainImage) {
    embed.setImage(data.mainImage as string);
  }

  return embed;
};

const _commands: Array<SlashCommand> = [];

const wikiCommand = (() => {
  const wikiCommandData = new SlashCommandBuilder()
    .setName("wiki")
    .setDescription(
      "Get the summary and URL for a wikipedia page matching your search term"
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("query")
        .setRequired(true)
        .setDescription("The query to search")
    );

  const execute = async (interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const query = interaction.options
      .getString("query")
      ?.trimRight()
      .trimStart();

    if (!query) {
      await interaction.reply({ content: "That's not a valid search term!" });
      return;
    }
    const wiki_summary = await getWikiSummary(query);

    await interaction.reply({ embeds: [make_embed(wiki_summary)] });
    return;
  };

  return { data: wikiCommandData, execute: execute };
})();

_commands.push(wikiCommand);

export const commands = _commands;
