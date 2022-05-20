const { SlashCommandBuilder } = require('@discordjs/builders');
const { setEnabled } = require('../helpers/setEnabled');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enable')
    .setDescription('Enables the bot on this server.'),
  async execute(interaction) {
    await setEnabled(interaction.guild.id, true);
    await interaction.reply({ content: 'Bot enabled', ephemeral: true });
  },
};
