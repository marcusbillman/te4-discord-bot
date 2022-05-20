const database = require('../database');

async function setEnabled(guildId, enabled) {
  const guild = await database.getGuild(guildId);
  const guildOptions = guild.options;

  const newGuildOptions = { ...guildOptions };
  newGuildOptions.enabled = enabled;

  await database.setGuildOptions(guildId, newGuildOptions);
}

module.exports = {
  setEnabled,
};
