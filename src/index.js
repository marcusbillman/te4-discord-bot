const { Client, Intents } = require('discord.js');
const { handleMessage } = require('./message-handler');
require('dotenv').config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  handleMessage(message);
});

client.login(process.env.TOKEN);
