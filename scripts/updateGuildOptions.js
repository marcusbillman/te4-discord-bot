const database = require('../src/database');
const { DEFAULT_GUILD_OPTIONS } = require('../src/constants');

console.log('Updating guild options... Press Ctrl+C when output has stopped.');

(async function () {
  await database.connect();
  const guilds = await database.getAllGuilds();

  guilds.forEach((guild) => {
    const guildOptions = guild.options;

    for (const [key, value] of Object.entries(DEFAULT_GUILD_OPTIONS)) {
      if (guildOptions[key] == null) {
        guildOptions[key] = value;
        console.log(`Guild ${guild.guildId} - ${key}: ${value}`);
      }
    }

    database.setGuildOptions(guild.guildId, guildOptions);
  });
})();
