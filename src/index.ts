import {QuackClient, secrets} from './util';


const {Events, REST, GatewayIntentBits, Collection} = require('discord.js');



const client = new QuackClient({intents: [GatewayIntentBits.Guilds]});
client.commands = new Collection();

client.once(Events.ClientReady, (c: typeof Events.ClientReady) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.login(secrets.token);
