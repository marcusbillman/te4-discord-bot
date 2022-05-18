const { SlashCommandBuilder } = require('@discordjs/builders');
const database = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('options')
    .setDescription(
      'Change how Ad Bot works on this server. Leave command blank to view current options.'
    )
    .addIntegerOption((option) =>
      option
        .setName('cooldown')
        .setDescription(
          'Minimum time in minutes between ad messages (default: 30)'
        )
        .setMinValue(0)
    )
    .addBooleanOption((option) =>
      option
        .setName('enabled')
        .setDescription(
          'Whether the bot should react to messages (default: true)'
        )
    ),
  async execute(interaction) {
    const commandOptions = interaction.options.data;

    const guild = await database.getGuild(interaction.guild.id);
    const guildOptions = guild.options;

    if (commandOptions.length === 0) {
      return await interaction.reply({
        content:
          '**Options for this server**\n' + optionsToString(guildOptions),
        ephemeral: true,
      });
    }

    const newGuildOptions = { ...guildOptions };
    for (const option of commandOptions) {
      newGuildOptions[option.name] = option.value;
    }

    await database.setGuildOptions(interaction.guild.id, newGuildOptions);

    await interaction.reply({
      content: 'Options have been updated',
      ephemeral: true,
    });
  },
};

function optionsToString(options) {
  if (options == null || Object.keys(options).length === 0) {
    return '(No options set)';
  }

  const lines = [];
  for (const [key, value] of Object.entries(options)) {
    lines.push(`${key}: ${value}`);
  }
  return lines.join('\n');
}
