/* eslint node/no-unpublished-require: "off" */

const pathutil = require('path');
const filesystem = require('fs');

const rootDir = (() => {
  let checkDir: string = pathutil.resolve('.');
  const pathsep = pathutil.sep;

  const fullPath = pathutil.resolve('.').split(pathsep).reverse();

  for (let _ of fullPath) {
    let dirContents = filesystem.readdirSync(checkDir);

    if (dirContents.includes('package.json')) {
      return checkDir;
    }
    checkDir = pathutil.join(checkDir, '..');
  }

  throw new Error("Can't find the project root");
})();

const secretPath = pathutil.join(rootDir, './secret.json');

const {Client, Events, GatewayIntentBits} = require('discord.js');

const {token} = require(secretPath);

const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.once(Events.ClientReady, (c: any) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.login(token);
