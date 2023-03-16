import {Message} from 'discord.js';

import {makeQuackCommand, QuackCommand} from './util';

export const commands: Array<QuackCommand> = [
  makeQuackCommand('ping', 'pings for a reply', async (m: Message) => {
    m.reply('Pong');
  }),
];
