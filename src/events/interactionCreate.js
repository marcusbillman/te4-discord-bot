module.exports = {
  name: 'interactionCreate',
  once: false,
  execute(interaction) {
    handleInteraction(interaction);
  },
};

async function handleInteraction(interaction) {
  if (!interaction.isCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
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
}
