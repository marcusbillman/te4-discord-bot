const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { handleMessage } = require('./src/message-handler');
require('dotenv').config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.commands = new Collection();
const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.data.name, command);
}

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

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'An error occurred while executing this command',
      ephemeral: true,
    });
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  handleMessage(message, distube);
});

client.login(process.env.TOKEN);
