const { SlashCommandBuilder } = require('@discordjs/builders');
const { setEnabled } = require('../helpers/setEnabled');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disable')
    .setDescription('Enables the bot on this server.'),
  async execute(interaction) {
    await setEnabled(interaction.guild.id, false);
    await interaction.reply({ content: 'Bot disabled', ephemeral: true });
  },
};
