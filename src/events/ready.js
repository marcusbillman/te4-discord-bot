module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(
      `Logged in as ${client.user.tag} in ${client.guilds.cache.size} guilds`
    );
  },
};
