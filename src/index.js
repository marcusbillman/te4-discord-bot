const { Client, Intents } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { handleMessage } = require('./message-handler');
require('dotenv').config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const distube = new DisTube(client, {
  youtubeDL: false,
  plugins: [new YtDlpPlugin()],
  leaveOnFinish: true,
});

distube.on('error', (channel, error) => {
  console.error(error);
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  handleMessage(message, distube);
});

client.login(process.env.TOKEN);
