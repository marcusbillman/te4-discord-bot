const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops any audio playing in voice channels'),
  async execute(interaction) {
    const distube = interaction.client.distube;
    const guildId = interaction.guild.id;

    distube.stop(guildId);

    await interaction.reply({
      content: 'Stopped audio in voice channel',
      ephemeral: true,
    });
  },
};
