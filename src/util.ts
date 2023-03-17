import path = require('path');
import filesystem = require('fs');

import {Client, Collection, SlashCommandBuilder, Message} from 'discord.js';

export interface QuackCommand {
  data: SlashCommandBuilder;
  execute: (_: Message) => Promise<void>;
}

export function makeQuackCommand(
  name: string,
  description: string,
  exec: (_: Message) => Promise<void>
): QuackCommand {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute: exec,
  };
}

export class QuackClient extends Client {
  commands?: typeof Collection;
}

export const rootDir = (() => {
  let checkDir: string = path.resolve('.');
  const pathsep = path.sep;

  const fullPath = path.resolve('.').split(pathsep).reverse();

  for (const _ of fullPath) {
    const dirContents = filesystem.readdirSync(checkDir);

    if (dirContents.includes('package.json')) {
      return checkDir;
    }
    checkDir = path.join(checkDir, '..');
  }

  throw new Error("Can't find the project root");
})();

export const secretPath = path.join(rootDir, './secret.json');
export const secrets = require(secretPath);
