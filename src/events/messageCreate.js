const database = require('../database');
const weighted = require('weighted');

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

  // Determine whether to reply based on guild probability option
  const probability = guild.options.probability;
  const outcomeIsFavorable = Math.random() <= probability;
  if (!outcomeIsFavorable) return;

  const ads = await database.getAdsForQuery(message.content);
  if (ads.length <= 0) return;

  let scores = [];
  ads.forEach((ad) => {
    scores.push(ad.score);
  });

  const ad = weighted.select(ads, scores);

  console.log(`Sending ad - ${message.author.username}: ${message.content}`);

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

  const keyword = ad.highlights[0].texts[0].value;

  const processedSegue = segue.content
    .replace('[N]', ad.name)
    .replace('[K]', keyword)
    .replace(
      // Capitalize first letter of each sentence using RegEx witchcraft
      /(?<=(?:^|[.?!])[^\wŽžÀ-ÿ]*)[\wŽžÀ-ÿ]/g,
      (i) => i.toUpperCase()
    );

  const finalMessage = `**${processedSegue}**\n${ad.content}`;

  message.reply(finalMessage);
}
