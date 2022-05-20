const database = require('../database');

module.exports = {
  name: 'messageCreate',
  once: false,
  execute(client, message) {
    if (message.author.bot) return;
    handleMessage(message, client.distube);
  },
};

async function handleMessage(message, distube) {
  const guildId = message.guild.id;
  const guild = await database.getGuild(guildId);

  // Check whether bot is enabled
  const enabled = guild.options.enabled;
  if (!enabled) return;

  // Check whether cooldown has elapsed
  const lastTrigger = guild.lastTrigger;
  const timeSinceLastTrigger = new Date() - lastTrigger;
  const cooldown = guild.options.cooldown * 60 * 1000;
  const cooldownElapsed =
    lastTrigger == null || timeSinceLastTrigger >= cooldown;
  if (!cooldownElapsed) return;

  const ad = await database.getTopAdForQuery(message.content);
  if (ad == null) return;

  if (
    guild.options.audio &&
    ad.videoUrl != null &&
    message.member.voice.channel != null
  ) {
    playAdVideo(ad.videoUrl, message, distube);
  }
  await replyWithSegueAndAd(ad, message);

  await database.upsertLastTrigger(guildId);
}

function playAdVideo(videoUrl, message, distube) {
  distube.play(message.member.voice.channel, videoUrl, {
    message,
    textChannel: message.channel,
    member: message.member,
  });
}

async function replyWithSegueAndAd(ad, message) {
  const segue = await database.getRandomSegue();

  const firstKeyword = ad.keywords.find((keyword) =>
    message.content
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
      .split(/\s+/)
      .includes(keyword.toLowerCase())
  );
  const interpolatedSegue = segue.content
    .replace('[N]', ad.name)
    .replace('[K]', firstKeyword);

  message.reply(`${interpolatedSegue}\n\n${ad.content}`);
}
