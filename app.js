const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
require('dotenv').config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.distube = new DisTube(client, {
  youtubeDL: false,
  plugins: [new YtDlpPlugin()],
  leaveOnFinish: true,
});

client.distube.on('error', (channel, error) => {
  console.error(error);
});

client.commands = new Collection();
const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.data.name, command);
}

const eventFiles = fs
  .readdirSync('./src/events')
  .filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

client.login(process.env.TOKEN);
