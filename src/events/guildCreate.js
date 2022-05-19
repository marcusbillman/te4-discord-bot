const database = require('../database');
const { DEFAULT_GUILD_OPTIONS } = require('../constants');

module.exports = {
  name: 'guildCreate',
  once: true,
  async execute(guild) {
    console.log(
      `Joined guild ${guild.name} (${guild.id}) and set default options`
    );
    await database.setGuildOptions(guild.id, DEFAULT_GUILD_OPTIONS);
  },
};
