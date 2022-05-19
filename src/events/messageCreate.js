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
  if (!(await guildAllowsTrigger(guildId))) return;

  const ad = await database.getTopAdForQuery(message.content);
  if (ad == null) return;

  if (message.member.voice.channel != null && ad.videoUrl != null) {
    playAdVideo(ad.videoUrl, message, distube);
  }
  await replyWithSegueAndAd(ad, message);

  await database.upsertLastTrigger(guildId);
}

async function guildAllowsTrigger(guildId) {
  const guild = await database.getGuild(guildId);

  const enabled = guild.options.enabled;
  if (!enabled) return;

  const lastTrigger = guild.lastTrigger;
  const timeSinceLastTrigger = new Date() - lastTrigger;
  const cooldown = guild.options.cooldown * 60 * 1000;

  return lastTrigger == null || timeSinceLastTrigger >= cooldown;
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
    message.content.toLowerCase().includes(keyword)
  );
  const interpolatedSegue = segue.content
    .replace('[N]', ad.name)
    .replace('[K]', firstKeyword);

  message.reply(`${interpolatedSegue}\n\n${ad.content}`);
}
