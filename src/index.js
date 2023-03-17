"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const { Events, REST, GatewayIntentBits, Collection } = require('discord.js');
const client = new util_1.QuackClient({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as ${c.user.tag}`);
});
client.login(util_1.secrets.token);
